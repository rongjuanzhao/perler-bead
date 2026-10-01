"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

const COOKIE_CONSENT_STORAGE_KEY = "cookieConsent";
const OPEN_COOKIE_SETTINGS_EVENT = "perlerbeadmake:open-cookie-settings";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function updateConsent(marketingEnabled: boolean) {
  window.gtag?.("consent", "update", {
    ad_storage: marketingEnabled ? "granted" : "denied",
    analytics_storage: "granted",
    ad_user_data: marketingEnabled ? "granted" : "denied",
    ad_personalization: marketingEnabled ? "granted" : "denied",
  });
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const openSettings = () => setShowBanner(true);

    if (!localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)) {
      openSettings();
    }

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
    updateConsent(true);
    setShowBanner(false);
  };

  const useBasicAnalyticsOnly = () => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "rejected");
    updateConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <section
      aria-describedby="cookie-consent-description"
      aria-labelledby="cookie-consent-title"
      className="fixed bottom-0 left-0 z-[100] w-full border-t border-[#1A1A1A] bg-[#FFFDF8] p-4 shadow-[0_-12px_32px_rgba(26,26,26,0.16)] sm:bottom-5 sm:left-5 sm:max-w-lg sm:border"
      role="dialog"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center bg-[#1A1A1A] text-[#F3EBE2]" aria-hidden="true">
          🍪
        </span>
        <div>
          <p id="cookie-consent-title" className="text-sm font-bold text-[#1A1A1A]">
            Cookies and basic analytics
          </p>
          <p id="cookie-consent-description" className="mt-1 text-xs leading-5 text-[#3D3D3D]">
            We use basic analytics to improve the Perler Bead Pattern Maker. Choose whether to also allow marketing technologies.{" "}
            <Link href="/privacy-policy#cookies" className="font-semibold underline decoration-[#A85C40] underline-offset-2">
              Learn more
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={acceptAll}
          className="min-h-10 border border-[#1A1A1A] bg-[#1A1A1A] px-4 text-xs font-bold text-[#FFFDF8] transition-colors hover:bg-[#3D3D3D]"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={useBasicAnalyticsOnly}
          className="min-h-10 border border-[#1A1A1A] bg-[#FFFDF8] px-4 text-xs font-bold text-[#1A1A1A] transition-colors hover:bg-[#F3EBE2]"
        >
          Basic analytics only
        </button>
      </div>
    </section>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className={cn(
        "text-left underline decoration-[#A85C40] underline-offset-2 transition-colors hover:text-[#1A1A1A]",
        className
      )}
    >
      Cookie settings
    </button>
  );
}
