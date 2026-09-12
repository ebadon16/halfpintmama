"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface PurchaseTrackingProps {
  orderId: string;
  value: number;
  currency: string;
  items: string;
}

// Records the completed purchase once the buyer lands on the success page.
// Without this the funnel shows checkouts starting and nothing ever finishing,
// which makes every conversion number on the shop wrong.
export function PurchaseTracking({ orderId, value, currency, items }: PurchaseTrackingProps) {
  const sent = useRef(false);
  useEffect(() => {
    // React runs effects twice in development, and a buyer may refresh the page.
    if (sent.current) return;
    sent.current = true;
    trackEvent("purchase", { transaction_id: orderId, value, currency, items });
  }, [orderId, value, currency, items]);
  return null;
}
