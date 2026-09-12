// One word for the state of the shop, for page copy that changes with it.
//
//   waitlist  — Stripe not configured; /shop is the "coming soon" page
//   preorder  — selling the book, labels free with it
//   launched  — selling both separately
//
// Pages read this at render time. Static pages bake it in at build, which is
// fine: a phase flip on Vercel needs a redeploy anyway.

import { getShopPhase, type ShopStatus } from "./catalog";
import { isShopEnabled } from "./stripe";

export function getShopStatus(): ShopStatus {
  const phase = getShopPhase();
  return isShopEnabled(phase) ? phase : "waitlist";
}

// The cookbook pages (/shop, /cookbook-resources) stay out of the
// index while the shop is still a waitlist, and open up the moment preorders
// do. Flip happens with the same deploy that turns the shop on.
export function isShopPublic(): boolean {
  return getShopStatus() !== "waitlist";
}
