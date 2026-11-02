"use client";

import { useEffect } from "react";
import { rememberAttribution } from "@/lib/attribution";

// Remembers utm_* / ?ref= from the landing URL for this browser session so the
// shop can stamp it on the order. Renders nothing.
export function AttributionCapture() {
  useEffect(() => {
    rememberAttribution();
  }, []);
  return null;
}
