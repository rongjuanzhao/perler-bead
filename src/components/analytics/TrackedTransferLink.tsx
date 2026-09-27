"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackTransferEntry, type TransferType } from "@/src/lib/analytics";

type TrackedTransferLinkProps = ComponentProps<typeof Link> & {
  transferType: TransferType;
};

export function TrackedTransferLink({
  transferType,
  onClick,
  ...props
}: TrackedTransferLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          trackTransferEntry(transferType);
        }
      }}
    />
  );
}
