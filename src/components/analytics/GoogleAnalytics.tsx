"use client";

import { useEffect } from "react";
import Script from "next/script";
import { markAnalyticsReady } from "@/src/lib/analytics";

const GA_MEASUREMENT_ID = "G-3B4P4LCYH1";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    let retryTimer: number | undefined;
    let retries = 0;

    const waitForGtag = () => {
      if (window.gtag) {
        markAnalyticsReady();
        return;
      }

      if (retries < 40) {
        retries += 1;
        retryTimer = window.setTimeout(waitForGtag, 50);
      }
    };

    waitForGtag();
    return () => {
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, []);

  return (
    <>
      <Script strategy="afterInteractive" src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "window.dataLayer = window.dataLayer || [];" +
            "function gtag(){dataLayer.push(arguments);}" +
            "window.gtag = gtag;" +
            "var marketingConsent = false;" +
            "try { marketingConsent = window.localStorage.getItem('cookieConsent') === 'accepted'; } catch (error) {}" +
            "gtag('consent', 'default', {" +
            "analytics_storage:'granted'," +
            "ad_storage: marketingConsent ? 'granted' : 'denied'," +
            "ad_user_data: marketingConsent ? 'granted' : 'denied'," +
            "ad_personalization: marketingConsent ? 'granted' : 'denied'" +
            "});" +
            "gtag('js', new Date());" +
            "gtag('config', '" +
            GA_MEASUREMENT_ID +
            "', { page_path: window.location.pathname });",
        }}
      />
    </>
  );
}
