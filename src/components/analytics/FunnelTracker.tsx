"use client";

import { useEffect } from "react";
import {
  trackHomeView,
  trackTransferToolView,
  type TransferType,
} from "@/src/lib/analytics";

export function HomeFunnelTracker() {
  useEffect(() => {
    trackHomeView();
  }, []);

  return null;
}

export function TransferToolFunnelTracker({ transferType }: { transferType: TransferType }) {
  useEffect(() => {
    trackTransferToolView(transferType);
  }, [transferType]);

  return null;
}
