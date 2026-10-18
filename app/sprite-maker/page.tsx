import type { Metadata } from 'next';
import SpriteMaker from '@/src/features/sprite-maker/SpriteMaker.client';
import { SpriteMakerHero, SpriteMakerInformation } from '@/src/features/sprite-maker/SpriteMakerContent';
import base from '@/src/features/pixel-art/PixelArtStudio.module.css';
import styles from '@/src/features/sprite-maker/SpriteMaker.module.css';
import Header from '@/src/features/bead-home/components/Header';
import { enMessages } from '@/src/features/bead-home/messages/en';
import { siteUrl } from '@/src/config/site';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: {
    absolute: 'Sprite Maker — Pixel Art Animation Editor & Free GIF Exports',
  },
  description: 'Draw and animate pixel art sprites with onion skin, up to 32 frames, live preview, and free GIF and sprite sheet exports. Works privately in your browser.',
  alternates: { canonical: `${siteUrl}/sprite-maker` },
};
export default function SpriteMakerPage() {
  return <>
    <Header brandName={enMessages.brandName} messages={enMessages.header}/>
    <main className={`${base.page} ${styles.page}`}>
      <SpriteMakerHero />
      <SpriteMaker />
      <SpriteMakerInformation />
    </main>
  </>;
}
