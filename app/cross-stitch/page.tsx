import type { Metadata } from "next";
import CrossStitchDesigner from "@/src/features/cross-stitch/CrossStitchDesigner.client";
import { CrossStitchHero, CrossStitchInformation } from "@/src/features/cross-stitch/CrossStitchContent";
import styles from "@/src/features/cross-stitch/CrossStitchDesigner.module.css";
import Header from "@/src/features/bead-home/components/Header";
import { enMessages } from "@/src/features/bead-home/messages/en";
import { siteUrl } from "@/src/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Cross Stitch Pattern Designer - DMC Colors & Free PDF Export",
  },
  description:
    "Draw cross stitch charts stitch by stitch with real DMC floss colors, then export a printable PDF with a symbol legend and full thread list. Free online tool — everything stays on your device.",
  alternates: { canonical: `${siteUrl}/cross-stitch` },
};

export default function CrossStitchPage() {
  return <>
    <Header brandName={enMessages.brandName} messages={enMessages.header} />
    <main className={styles.page}>
      <CrossStitchHero />
      <CrossStitchDesigner />
      <CrossStitchInformation />
    </main>
  </>;
}
