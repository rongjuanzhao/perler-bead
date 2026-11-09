"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { colorLibraries } from "@/src/features/beadcolor/libraries";
import { externalPalettes, type PaletteBrand } from "@/src/components/bead-studio/brand-palettes";
import { mardBasicPalette, mardCompletePalette } from "@/src/components/bead-studio/mard-palettes";
import { paletteOptions } from "../../../public/editor/src/palettes/catalog.js";
import { formatMessage } from "./messages/format";
import type { HomeMessages } from "./messages/types";

export default function PaletteShowcase({ messages }: { messages: HomeMessages["palette"] }) {
  const [brand, setBrand] = useState<PaletteBrand>("Perler");
  const selectedLibrary = colorLibraries.find((library) => library.name === brand);
  const palette = useMemo(() => {
    if (brand === "MARD Basic") return mardBasicPalette;
    if (brand === "MARD Complete") return mardCompletePalette;
    return externalPalettes[brand];
  }, [brand]);

  return (
    <section className="materials" id="palette">
      <div className="materials-copy">
        <h2>{formatMessage(messages.title, { brand })}</h2>
        <p>{messages.description}</p>
        <div className="palette-tabs" aria-label={messages.chooserLabel}>
          {paletteOptions.map((option) => <button type="button" className={brand === option.value ? "is-active" : ""} aria-pressed={brand === option.value} key={option.value} onClick={() => setBrand(option.value as PaletteBrand)}><span>{option.value}</span><small>{formatMessage(messages.colors, { count: option.count })}</small></button>)}
        </div>
        {selectedLibrary && <Link className="palette-view-all" href={`/beadcolor/${selectedLibrary.slug}`}>{messages.viewAll} <ArrowRight size={16} aria-hidden="true" /></Link>}
      </div>
      <div className="swatch-list">
        {palette.slice(0, 12).map((swatch) => {
          const isMard = brand === "MARD Basic" || brand === "MARD Complete";
          const displayName = isMard ? swatch.name.replace(/^MARD\s+/, "") : swatch.name;
          const displayBrand = isMard ? brand.replace(/^MARD\s+/, "") : brand;

          return <div className="swatch" key={swatch.code}><i style={{ background: swatch.hex }} /><span>{displayName}<small>{displayBrand} {swatch.code}</small></span><b>{messages.available}</b></div>;
        })}
      </div>
    </section>
  );
}
