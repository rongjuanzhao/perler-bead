"use client";

import { ChangeEvent, DragEvent, type CSSProperties, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, ExternalLink, FileSpreadsheet, Grid3X3, ImagePlus, RefreshCw, X } from "lucide-react";
import { externalPalettes, type PaletteBrand } from "./brand-palettes";
import { mardBasicPalette, mardCompletePalette } from "./mard-palettes";

const distance = (a: number[], b: number[]) =>
  Math.pow(a[0] - b[0], 2) * 0.3 + Math.pow(a[1] - b[1], 2) * 0.59 + Math.pow(a[2] - b[2], 2) * 0.11;

const hexRgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

export default function BeadStudio() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [grid, setGrid] = useState(29);
  const [sourceRatio, setSourceRatio] = useState(1);
  const [maxColors, setMaxColors] = useState(12);
  const [brand, setBrand] = useState<PaletteBrand>("MARD Basic");
  const [dragging, setDragging] = useState(false);
  const [cells, setCells] = useState<Array<number | null>>([]);
  const [backgroundMode, setBackgroundMode] = useState<"keep" | "remove-light">("keep");
  const [beadShape, setBeadShape] = useState<"pixel" | "bead">("pixel");
  const [showGrid, setShowGrid] = useState(true);
  const [showCodes, setShowCodes] = useState(true);
  const [hoveredColor, setHoveredColor] = useState<number | null>(null);
  const [comparePosition, setComparePosition] = useState(52);

  const selectedPalette = useMemo(() => {
    if (brand === "MARD Basic") return mardBasicPalette;
    if (brand === "MARD Complete") return mardCompletePalette;
    return externalPalettes[brand];
  }, [brand]);
  const gridHeight = useMemo(() => Math.max(1, Math.min(120, Math.round(grid * sourceRatio))), [grid, sourceRatio]);
  const counts = useMemo(() => {
    const usage = Array(selectedPalette.length).fill(0) as number[];
    cells.forEach((index) => { if (index !== null) usage[index]++; });
    return usage;
  }, [cells, selectedPalette.length]);
  const activePalette = useMemo(() => selectedPalette.filter((_, index) => counts[index] > 0), [counts, selectedPalette]);
  const totalBeads = useMemo(() => counts.reduce((sum, count) => sum + count, 0), [counts]);

  useEffect(() => {
    if (!fileUrl || !canvasRef.current) return;
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = grid;
      sampleCanvas.height = gridHeight;
      const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.imageSmoothingEnabled = true;
      context.drawImage(image, 0, 0, grid, gridHeight);
      const pixels = context.getImageData(0, 0, grid, gridHeight);
      const paletteRgb = selectedPalette.map((swatch) => hexRgb(swatch.hex));
      const cornerIndexes = [0, (grid - 1) * 4, (gridHeight - 1) * grid * 4, ((gridHeight * grid) - 1) * 4];
      const background = [0, 1, 2].map((channel) => Math.round(cornerIndexes.reduce((sum, index) => sum + pixels.data[index + channel], 0) / 4));
      const nearest = Array<number | null>(grid * gridHeight).fill(null);
      const frequency = Array(selectedPalette.length).fill(0) as number[];
      for (let i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i + 3] < 80) continue;
        const rgb = [pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]];
        if (backgroundMode === "remove-light" && distance(rgb, background) < 1150) continue;
        const closest = paletteRgb.reduce((best, candidate, index) =>
          distance(rgb, candidate) < distance(rgb, paletteRgb[best]) ? index : best, 0);
        nearest[i / 4] = closest;
        frequency[closest]++;
      }
      const candidates = frequency.map((count, index) => ({ count, index })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count).slice(0, maxColors).map((item) => item.index);
      setCells(nearest.map((current, cellIndex) => {
        if (current === null || candidates.length === 0) return null;
        const pixelIndex = cellIndex * 4;
        const rgb = [pixels.data[pixelIndex], pixels.data[pixelIndex + 1], pixels.data[pixelIndex + 2]];
        return candidates.reduce((best, candidate) => distance(rgb, paletteRgb[candidate]) < distance(rgb, paletteRgb[best]) ? candidate : best, candidates[0]);
      }));
    };
    image.src = fileUrl;
  }, [backgroundMode, fileUrl, grid, gridHeight, maxColors, selectedPalette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fileUrl || cells.length === 0) return;
    const cellSize = showCodes ? 30 : 16;
    canvas.width = grid * cellSize;
    canvas.height = gridHeight * cellSize;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    cells.forEach((paletteIndex, index) => {
      const x = (index % grid) * cellSize;
      const y = Math.floor(index / grid) * cellSize;
      if (paletteIndex !== null) {
        const swatch = selectedPalette[paletteIndex];
        if (!swatch) return;
        context.fillStyle = swatch.hex;
        if (beadShape === "bead") {
          context.beginPath();
          context.arc(x + cellSize / 2, y + cellSize / 2, cellSize * .39, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(x, y, cellSize, cellSize);
        }
        if (showCodes) {
          const [r, g, b] = hexRgb(swatch.hex);
          context.fillStyle = r * .299 + g * .587 + b * .114 < 145 ? "#ffffff" : "#20202d";
          context.font = `700 ${Math.max(8, cellSize * .3)}px sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(swatch.code, x + cellSize / 2, y + cellSize / 2 + .5);
        }
      }
      if (showGrid) {
        context.strokeStyle = "rgba(52, 48, 64, .18)";
        context.lineWidth = 1;
        context.strokeRect(x + .5, y + .5, cellSize - 1, cellSize - 1);
      }
      if (hoveredColor !== null) {
        if (paletteIndex === hoveredColor) {
          context.strokeStyle = "#ee6a55";
          context.lineWidth = Math.max(2, cellSize * .13);
          context.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);
        }
      }
    });
  }, [beadShape, cells, fileUrl, grid, gridHeight, hoveredColor, selectedPalette, showCodes, showGrid]);

  const acceptFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setHoveredColor(null);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setSourceRatio(image.naturalHeight / image.naturalWidth);
      setFileUrl(url);
    };
    image.src = url;
    setFileName(file.name);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  const handleCanvasHover = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - bounds.left) / bounds.width) * grid);
    const y = Math.floor(((event.clientY - bounds.top) / bounds.height) * gridHeight);
    const paletteIndex = cells[y * grid + x];
    setHoveredColor(paletteIndex ?? null);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${fileName.replace(/\.[^.]+$/, "") || "bead-pattern"}-${grid}x${gridHeight}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadUsage = () => {
    const rows = [["Brand", "Code", "Color", "Hex", "Beads"], ...selectedPalette.flatMap((swatch, index) => counts[index] ? [[brand, swatch.code, swatch.name, swatch.hex, String(counts[index])]] : [])];
    const blob = new Blob([`\uFEFF${rows.map((row) => row.join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${fileName.replace(/\.[^.]+$/, "") || "bead-pattern"}-color-list.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startQuickPattern = () => document.getElementById("quick-studio")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="bead-shell">
      <nav className="bead-nav" aria-label="Primary navigation">
        <a className="bead-brand" href="#studio"><span>bead</span>loom</a>
        <div className="bead-nav-links"><a href="#how">How it works</a><a href="#palette">Palette</a><a href="#about">About</a></div>
        <button className="nav-action" onClick={() => window.location.assign("/editor")}>Create a pattern</button>
      </nav>

      <section className="bead-hero" id="studio">
        <div className="hero-message">
          <div className="hero-copy">
            <h1>Perler Bead Pattern Maker </h1>
            <p className="hero-intro">Turn a favorite image into a colorful bead pattern — then bring it to life, one tiny piece at a time.</p>
            <button className="hero-action" onClick={startQuickPattern}>Start a pattern <span>→</span></button>
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

      <section className="studio-panel" id="quick-studio" aria-label="Bead pattern converter">
        <div className="panel-heading">
          <img className="panel-rainbow" src="/bead-rainbow.png" alt="Colorful fuse bead rainbow" />
          <div className="panel-title-copy"><h2>Free Perler Bead Pattern Maker</h2><p>Upload any image, and <strong>beadloom</strong> precisely matches it to over 1,600 authentic fuse bead colors. It supports major brands like Perler, Hama, Artkal, and MARD, and allows you to export patterns as PNG and PDF files for free.</p><div className="panel-benefits" aria-label="Product benefits"><span>✅ 无需注册</span><span>✅ 浏览器端处理</span><span>✅ 完全免费</span></div></div>
          <img className="panel-star" src="/bead-star.png" alt="Yellow and orange fuse bead star" />
        </div>
        <div className="converter-toolbar">
          <strong>CONVERTER</strong>
          {fileUrl && <div className="converter-toolbar-actions"><a href="/editor"><ExternalLink size={15} /> 去编辑</a><button type="button" onClick={() => { setFileUrl(null); setCells([]); setHoveredColor(null); }}><X size={15} /> Discard</button></div>}
        </div>
        <div className="studio-grid">
          <section className={`preview-workspace ${fileUrl ? "has-file" : "is-empty"}`}>
            {fileUrl ? (
              <>
                <div className="source-strip"><img src={fileUrl} alt="Selected source" /><div><strong>{fileName}</strong><span>{grid} × {gridHeight} beads · processed in your browser</span></div><button type="button" onClick={() => inputRef.current?.click()}><RefreshCw size={15} /> Replace</button></div>
                <div className={`pattern-preview ${hoveredColor !== null ? "is-color-hover" : ""}`}><div className="preview-label"><Grid3X3 size={15} /> {hoveredColor !== null ? `${brand} ${selectedPalette[hoveredColor].code} · ${selectedPalette[hoveredColor].name} · ${counts[hoveredColor]} beads` : `${grid} × ${gridHeight} grid`}</div><canvas ref={canvasRef} aria-label="Generated bead pattern preview" onMouseMove={handleCanvasHover} onMouseLeave={() => setHoveredColor(null)} /></div>
              </>
            ) : (
              <div className={`upload-zone ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
                <div className="upload-icon"><ImagePlus size={28} /></div>
                <h3>Drop image or click to upload</h3><p>JPEG, PNG, or WebP · processed in your browser</p>
                <button type="button" className="primary-button" onClick={() => inputRef.current?.click()}>Choose image <span>→</span></button>
              </div>
            )}
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])} />
          </section>
          <aside className="controls-card">
            <div className="brand-choice"><label htmlFor="bead-brand">Bead collection</label><select id="bead-brand" value={brand} onChange={(event) => { setCells([]); setHoveredColor(null); setBrand(event.target.value as PaletteBrand); }}><option value="MARD Basic">MARD 基础版（{mardBasicPalette.length} 色）</option><option value="MARD Complete">MARD 完整版（{mardCompletePalette.length} 色）</option><option value="Perler">Perler（{externalPalettes.Perler.length} 色）</option><option value="Hama">Hama（{externalPalettes.Hama.length} 色）</option><option value="Artkal S">Artkal S（{externalPalettes["Artkal S"].length} 色）</option></select></div>
            <div className="control-block"><label htmlFor="grid-size">Pattern width <strong>{grid} beads</strong></label><input id="grid-size" type="range" min="16" max="58" step="1" value={grid} onChange={(event) => setGrid(Number(event.target.value))} /><div className="range-ends"><span>16 beads</span><span>58 beads</span></div></div>
            <div className="control-block"><label htmlFor="color-count">Color limit <strong>{maxColors} colors</strong></label><input id="color-count" type="range" min="4" max="24" value={maxColors} onChange={(event) => setMaxColors(Number(event.target.value))} /><div className="range-ends"><span>Simple</span><span>Detailed</span></div></div>
            <div className="quick-options">
              <label><span>Background</span><select value={backgroundMode} onChange={(event) => setBackgroundMode(event.target.value as "keep" | "remove-light")}><option value="keep">Keep background</option><option value="remove-light">Remove similar background</option></select></label>
              <div className="option-row"><span>Bead shape</span><div className="segmented"><button className={beadShape === "pixel" ? "active" : ""} onClick={() => setBeadShape("pixel")}>Square</button><button className={beadShape === "bead" ? "active" : ""} onClick={() => setBeadShape("bead")}>Round</button></div></div>
              <div className="toggle-row"><label><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /> Grid</label><label><input type="checkbox" checked={showCodes} onChange={(event) => setShowCodes(event.target.checked)} /> Color codes</label></div>
            </div>
            {fileUrl ?
              <div className="usage-compact"><div><strong>{brand} color list</strong><span>{activePalette.length} colors · {totalBeads} beads</span></div><div className="usage-scroll">{selectedPalette.map((swatch, index) => counts[index] > 0 && <div className="usage-row" key={swatch.code}><i style={{ background: swatch.hex }} /><b>{swatch.code}</b><span>{swatch.name}</span><em>{counts[index]}</em></div>)}</div></div>
              : <p className="hint"><RefreshCw size={14} /> Your pattern appears here instantly.</p>}
            <div className="export-actions"><button className="primary-button full" onClick={download} disabled={!fileUrl}><Download size={17} /> 导出图片</button><button className="secondary-button full" onClick={downloadUsage} disabled={!fileUrl}><FileSpreadsheet size={16} /> 导出色号</button></div>
            {fileUrl && <a className="full-editor-link" href="/editor">Open full editor <ExternalLink size={14} /></a>}
          </aside>
        </div>
      </section>

      <section className="materials" id="palette">
        <div><p className="eyebrow">02 / MATERIALS</p><h2>{fileUrl ? "Your bead list" : `A practical ${brand} palette`}</h2><p>{fileUrl ? `${grid} × ${gridHeight} grid with ${totalBeads} occupied cells, matched to ${brand} color codes.` : `Real ${brand} color codes for fast, buildable patterns.`}</p></div>
        <div className="swatch-list">{(fileUrl ? selectedPalette.filter((_, index) => counts[index] > 0) : selectedPalette.slice(0, 12)).map((swatch) => { const index = selectedPalette.indexOf(swatch); return <div className="swatch" key={swatch.code}><i style={{ background: swatch.hex }} /><span>{swatch.name}<small>{brand} {swatch.code}</small></span><b>{fileUrl ? `${counts[index]} beads` : "available"}</b></div>; })}</div>
      </section>

      <section className="how-it-works" id="how"><p className="eyebrow">03 / EASY AS 1, 2, 3</p><div className="steps"><article><span>01</span><h3>Choose a photo</h3><p>Portraits, pets, logos, and original art all work beautifully.</p></article><article><span>02</span><h3>Tune your grid</h3><p>Use fewer beads for a punchy icon or scale up for more detail.</p></article><article><span>03</span><h3>Make it yours</h3><p>Download your guide and begin placing color, one bead at a time.</p></article></div></section>

      <footer id="about"><a className="bead-brand" href="#studio"><span>bead</span>loom</a><p>Made for slow afternoons and bright little ideas.</p><span>© {new Date().getFullYear()} Beadloom Studio</span></footer>
    </main>
  );
}
