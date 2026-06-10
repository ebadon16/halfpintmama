type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: GtagParams) => void;
  }
}

// Safe no-op when GA4 isn't loaded (NEXT_PUBLIC_GA_ID unset or blocked).
export function trackEvent(eventName: string, params?: GtagParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}
