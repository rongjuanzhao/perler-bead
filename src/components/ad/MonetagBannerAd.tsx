"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useAdConfig } from "@/src/hooks/useAdConfig";

const MonetagBannerAd = () => {
  const { user, loading } = useAuth();
  const { showAds } = useAdConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!showAds || loading || user?.tier === 'pro') return;
    if (!containerRef.current || scriptRef.current) return;

    const script = document.createElement("script");
    script.dataset.zone = "10880693";
    script.src = "https://n6wxm.com/vignette.min.js";
    script.async = true;

    containerRef.current.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [showAds, loading, user?.tier]);

  if (!showAds || loading || user?.tier === 'pro') return null;

  return <div ref={containerRef} />;
};

export default MonetagBannerAd;
