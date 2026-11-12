import { useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const href = useLocation({ select: location => location.href });
  const lastPage = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (lastPage.current === href || !window.gtag) return;
    lastPage.current = href;
    window.gtag("event", "page_view", {
      page_path: href,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [href]);
  return null;
}