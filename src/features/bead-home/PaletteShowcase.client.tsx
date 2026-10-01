"use client";

import { useMemo, useState } from "react";
import { externalPalettes, type PaletteBrand } from "@/src/components/bead-studio/brand-palettes";
import { mardBasicPalette, mardCompletePalette } from "@/src/components/bead-studio/mard-palettes";
import { formatMessage } from "./messages/format";
import type { HomeMessages } from "./messages/types";

const paletteOptions: Array<{ value: PaletteBrand; count: number }> = [
  { value: "MARD Basic", count: mardBasicPalette.length },
  { value: "MARD Complete", count: mardCompletePalette.length },
  { value: "Perler", count: externalPalettes.Perler.length },
  { value: "Hama", count: externalPalettes.Hama.length },
  { value: "Artkal S", count: externalPalettes["Artkal S"].length },
];

export default function PaletteShowcase({ messages }: { messages: HomeMessages["palette"] }) {
  const [brand, setBrand] = useState<PaletteBrand>("MARD Basic");
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
          {paletteOptions.map((option) => <button type="button" className={brand === option.value ? "is-active" : ""} aria-pressed={brand === option.value} key={option.value} onClick={() => setBrand(option.value)}><span>{option.value}</span><small>{formatMessage(messages.colors, { count: option.count })}</small></button>)}
        </div>
      </div>
      <div className="swatch-list">
        {palette.slice(0, 12).map((swatch) => <div className="swatch" key={swatch.code}><i style={{ background: swatch.hex }} /><span>{swatch.name}<small>{brand} {swatch.code}</small></span><b>{messages.available}</b></div>)}
      </div>
    </section>
  );
}
