"use client";

import { ChangeEvent, DragEvent, type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Download, Grid3X3, ImagePlus, RefreshCw, X } from "lucide-react";

type Swatch = { name: string; hex: string; code: string };

const palette: Swatch[] = [
  { name: "Snow", hex: "#fbfaf5", code: "W01" },
  { name: "Ink", hex: "#252735", code: "B01" },
  { name: "Coral", hex: "#ec6b63", code: "R06" },
  { name: "Marigold", hex: "#f5bd49", code: "Y11" },
  { name: "Mint", hex: "#87cbb2", code: "G07" },
  { name: "Sky", hex: "#71aee8", code: "BL09" },
  { name: "Lilac", hex: "#a88bd6", code: "V04" },
  { name: "Rose", hex: "#e798ad", code: "P03" },
  { name: "Clay", hex: "#b97850", code: "BR05" },
  { name: "Moss", hex: "#587b58", code: "G12" },
  { name: "Navy", hex: "#40587c", code: "BL16" },
  { name: "Sand", hex: "#dcc89f", code: "T02" },
];

const distance = (a: number[], b: number[]) =>
  Math.pow(a[0] - b[0], 2) * 0.3 + Math.pow(a[1] - b[1], 2) * 0.59 + Math.pow(a[2] - b[2], 2) * 0.11;

const hexRgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

export default function BeadStudio() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [grid, setGrid] = useState(29);
  const [maxColors, setMaxColors] = useState(8);
  const [dragging, setDragging] = useState(false);
  const [counts, setCounts] = useState<number[]>([]);
  const [comparePosition, setComparePosition] = useState(52);

  const activePalette = useMemo(() => palette.slice(0, maxColors), [maxColors]);

  useEffect(() => {
    if (!fileUrl || !canvasRef.current) return;
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = grid;
      canvas.height = grid;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.imageSmoothingEnabled = true;
      context.drawImage(image, 0, 0, grid, grid);
      const pixels = context.getImageData(0, 0, grid, grid);
      const used = Array(activePalette.length).fill(0) as number[];
      const paletteRgb = activePalette.map((swatch) => hexRgb(swatch.hex));
      for (let i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i + 3] < 80) continue;
        const rgb = [pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]];
        const closest = paletteRgb.reduce((best, candidate, index) =>
          distance(rgb, candidate) < distance(rgb, paletteRgb[best]) ? index : best, 0);
        const color = paletteRgb[closest];
        pixels.data[i] = color[0];
        pixels.data[i + 1] = color[1];
        pixels.data[i + 2] = color[2];
        pixels.data[i + 3] = 255;
        used[closest]++;
      }
      context.putImageData(pixels, 0, 0);
      setCounts(used);
    };
    image.src = fileUrl;
  }, [activePalette, fileUrl, grid]);

  const acceptFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${fileName.replace(/\.[^.]+$/, "") || "bead-pattern"}-${grid}x${grid}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="bead-shell">
      <nav className="bead-nav" aria-label="Primary navigation">
        <a className="bead-brand" href="#studio"><span>bead</span>loom</a>
        <div className="bead-nav-links"><a href="#how">How it works</a><a href="#palette">Palette</a><a href="#about">About</a></div>
        <button className="nav-action" onClick={() => inputRef.current?.click()}>Create a pattern</button>
      </nav>

      <section className="bead-hero" id="studio">
        <div className="hero-message">
          <div className="hero-copy">
            <h1>Perler Bead Pattern Maker </h1>
            <p className="hero-intro">Turn a favorite image into a colorful bead pattern — then bring it to life, one tiny piece at a time.</p>
            <button className="hero-action" onClick={() => window.location.assign("/editor")}>Start a pattern <span>→</span></button>
            <div className="hero-notes"><span>Free to use</span><span>Private by design</span></div>
          </div>
        </div>
        <div className="pixel-motif motif-sun" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-one" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-two" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-sun motif-sun-two" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-one motif-cross-three" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-two motif-cross-four" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring motif-ring-two" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring motif-ring-three" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-one motif-cross-five" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-two motif-cross-six" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-sun motif-sun-three" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring motif-ring-four" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring motif-ring-five" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-one motif-cross-seven" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-two motif-cross-eight" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-cross-one motif-cross-nine" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring motif-ring-six" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-ring motif-ring-seven" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="pixel-motif motif-sun motif-sun-four" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="hero-tiles">
          <div className="sample-card sample-top" aria-hidden="true"><span>PHOTO → PIXELS</span><div className="sample-sky"><i /><i /><i /></div></div>
          <div className="sample-card sample-side" aria-hidden="true"><span>READY TO BUILD</span><div className="sample-grid">{Array.from({ length: 25 }, (_, index) => <i key={index} />)}</div></div>
          <div className="comparison-card" style={{ "--comparison": `${comparePosition}%` } as CSSProperties}>
            <div className="comparison-smooth"><span className="compare-label">Original</span><div className="smooth-art"><i /><i /><i /></div></div>
            <div className="comparison-pixel"><span className="compare-label">Bead pattern</span><div className="pixel-art">{Array.from({ length: 81 }, (_, index) => <i key={index} />)}</div></div>
            <div className="comparison-divider" aria-hidden="true"><span>↔</span></div>
            <input className="hero-comparison-range" type="range" min="0" max="100" value={comparePosition} onChange={(event) => setComparePosition(Number(event.target.value))} aria-label="Compare original image and bead pattern" />
          </div>
        </div>
      </section>

      <section className="studio-panel" aria-label="Bead pattern converter">
        <div className="panel-heading"><div><p className="eyebrow">01 / CONVERTER</p><h2>Your pattern workspace</h2></div>{fileUrl && <button className="quiet-button" onClick={() => { setFileUrl(null); setCounts([]); }}><X size={16} /> Start over</button>}</div>
        <div className="studio-grid">
          <div>
            {!fileUrl ? (
              <div className={`upload-zone ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
                <div className="upload-icon"><ImagePlus size={28} /></div>
                <h3>Drop an image here</h3><p>PNG, JPG, or WebP · stays on your device</p>
                <button className="primary-button" onClick={() => inputRef.current?.click()}>Choose image <span>→</span></button>
              </div>
            ) : (
              <div className="pattern-preview"><div className="preview-label"><Grid3X3 size={15} /> {grid} × {grid} grid</div><canvas ref={canvasRef} aria-label="Generated bead pattern preview" /></div>
            )}
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])} />
          </div>
          <aside className="controls-card">
            <div className="control-block"><label htmlFor="grid-size">Pattern size <strong>{grid} × {grid}</strong></label><input id="grid-size" type="range" min="16" max="58" step="1" value={grid} onChange={(event) => setGrid(Number(event.target.value))} /><div className="range-ends"><span>16 beads</span><span>58 beads</span></div></div>
            <div className="control-block"><label htmlFor="color-count">Color limit <strong>{maxColors} colors</strong></label><input id="color-count" type="range" min="4" max="12" value={maxColors} onChange={(event) => setMaxColors(Number(event.target.value))} /><div className="range-ends"><span>Simple</span><span>Detailed</span></div></div>
            <div className="brand-choice"><span>Bead collection</span><button type="button">Loom midi palette <span>12 colors</span></button></div>
            {fileUrl ? <button className="primary-button full" onClick={download}><Download size={17} /> Download PNG</button> : <p className="hint"><RefreshCw size={14} /> Your pattern appears here instantly.</p>}
          </aside>
        </div>
      </section>

      <section className="materials" id="palette">
        <div><p className="eyebrow">02 / MATERIALS</p><h2>{fileUrl ? "Your bead list" : "A small, joyful palette"}</h2><p>{fileUrl ? `${grid * grid} cells, matched to a focused palette you can actually work with.` : "Twelve richly pigmented shades, selected to keep every pattern bright and approachable."}</p></div>
        <div className="swatch-list">{activePalette.map((swatch, index) => <div className="swatch" key={swatch.code}><i style={{ background: swatch.hex }} /><span>{swatch.name}<small>{swatch.code}</small></span><b>{fileUrl ? `${counts[index] || 0} beads` : "available"}</b></div>)}</div>
      </section>

      <section className="how-it-works" id="how"><p className="eyebrow">03 / EASY AS 1, 2, 3</p><div className="steps"><article><span>01</span><h3>Choose a photo</h3><p>Portraits, pets, logos, and original art all work beautifully.</p></article><article><span>02</span><h3>Tune your grid</h3><p>Use fewer beads for a punchy icon or scale up for more detail.</p></article><article><span>03</span><h3>Make it yours</h3><p>Download your guide and begin placing color, one bead at a time.</p></article></div></section>

      <footer id="about"><a className="bead-brand" href="#studio"><span>bead</span>loom</a><p>Made for slow afternoons and bright little ideas.</p><span>© {new Date().getFullYear()} Beadloom Studio</span></footer>
    </main>
  );
}
