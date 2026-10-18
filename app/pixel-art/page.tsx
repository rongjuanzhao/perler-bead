import type { Metadata } from "next";
import PixelArtStudio from "@/src/features/pixel-art/PixelArtStudio.client";
import { PixelArtHero, PixelArtInformation } from "@/src/features/pixel-art/PixelArtContent";
import styles from "@/src/features/pixel-art/PixelArtStudio.module.css";
import Header from "@/src/features/bead-home/components/Header";
import { enMessages } from "@/src/features/bead-home/messages/en";
import { siteUrl } from "@/src/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Pixel Art Maker: Free Online Editor for Sprites & PNG Export",
  },
  description: "Draw pixel-perfect sprites, icons, and tiny worlds in a free browser-based pixel art editor.",
  alternates: { canonical: `${siteUrl}/pixel-art` },
};

export default function PixelArtPage() {
  return <>
    <Header brandName={enMessages.brandName} messages={enMessages.header} />
    <main className={styles.page}>
      <PixelArtHero />
      <PixelArtStudio />
      <PixelArtInformation />
    </main>
  </>;
}
