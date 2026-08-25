// Signed delivery tokens.
//
// A buyer's delivery link IS their credential — there are no accounts. The
// token carries who they are and what they bought, signed so it can't be forged
// or edited. Nothing is stored on our side: the token proves itself, and Stripe
// is consulted separately at access time for whether the payment still stands.
//
// Deliberately no expiry. The product promises unlimited reprints forever, so
// an expiring link would only generate support mail. Revocation comes from the
// Stripe refund check, not from the token.

import { createHmac, timingSafeEqual } from "node:crypto";
import type { ShopPhase } from "./catalog";

export interface DeliveryToken {
  email: string;
  // The Stripe Checkout Session, so access checks can re-read the real order.
  session: string;
  // What the buyer was promised at purchase time, not what the shop sells now.
  phase: ShopPhase;
  // Issued-at, for support questions. Not used for expiry.
  iat: number;
}

function secret(): string {
  const value = process.env.SHOP_TOKEN_SECRET;
  if (!value || value.length < 32) {
    // Failing loudly beats minting tokens nobody can verify later, or worse,
    // tokens signed with a guessable key.
    throw new Error(
      "SHOP_TOKEN_SECRET is missing or too short (needs 32+ characters)"
    );
  }
  return value;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function unb64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function signature(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

export function signDeliveryToken(token: DeliveryToken): string {
  const payload = b64url(JSON.stringify(token));
  return `${payload}.${signature(payload)}`;
}

// Returns null for anything not genuinely issued by us — forged, edited, or
// malformed. Callers treat null as "no such link" without distinguishing why.
export function verifyDeliveryToken(raw: string): DeliveryToken | null {
  if (typeof raw !== "string") return null;

  const dot = raw.indexOf(".");
  if (dot <= 0 || dot === raw.length - 1) return null;

  const payload = raw.slice(0, dot);
  const provided = raw.slice(dot + 1);

  let expected: string;
  try {
    expected = signature(payload);
  } catch {
    return null;
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so guard first. Length is not
  // secret — the signature is a fixed width.
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(unb64url(payload).toString("utf8"));
    if (
      typeof parsed?.email !== "string" ||
      typeof parsed?.session !== "string" ||
      (parsed?.phase !== "preorder" && parsed?.phase !== "launched") ||
      typeof parsed?.iat !== "number"
    ) {
      return null;
    }
    return parsed as DeliveryToken;
  } catch {
    return null;
  }
}
