"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdConfigContextType {
  showAds: boolean;
  setShowAds: (show: boolean) => void;
}

const AdConfigContext = createContext<AdConfigContextType>({
  showAds: true,
  setShowAds: () => {},
});

export function AdConfigProvider({ children }: { children: ReactNode }) {
  const [showAds, setShowAds] = useState(true);
  return (
    <AdConfigContext.Provider value={{ showAds, setShowAds }}>
      {children}
    </AdConfigContext.Provider>
  );
}

export function useAdConfig() {
  return useContext(AdConfigContext);
}
