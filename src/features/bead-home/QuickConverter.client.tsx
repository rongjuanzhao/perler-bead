"use client";

import { ChangeEvent, DragEvent, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, ExternalLink, FileSpreadsheet, Grid3X3, ImagePlus, RefreshCw, X } from "lucide-react";
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

const distance = (a: number[], b: number[]) =>
  Math.pow(a[0] - b[0], 2) * .3 + Math.pow(a[1] - b[1], 2) * .59 + Math.pow(a[2] - b[2], 2) * .11;

const hexRgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

export default function QuickConverter({ messages }: { messages: HomeMessages["converter"] }) {
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
        const closest = paletteRgb.reduce((best, candidate, index) => distance(rgb, candidate) < distance(rgb, paletteRgb[best]) ? index : best, 0);
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
        } else context.fillRect(x, y, cellSize, cellSize);
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
      if (hoveredColor !== null && paletteIndex === hoveredColor) {
        context.strokeStyle = "#ee6a55";
        context.lineWidth = Math.max(2, cellSize * .13);
        context.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);
      }
    });
  }, [beadShape, cells, fileUrl, grid, gridHeight, hoveredColor, selectedPalette, showCodes, showGrid]);

  const acceptFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setHoveredColor(null);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { setSourceRatio(image.naturalHeight / image.naturalWidth); setFileUrl(url); };
    image.src = url;
    setFileName(file.name);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); acceptFile(event.dataTransfer.files[0]); };
  const handleCanvasHover = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - bounds.left) / bounds.width) * grid);
    const y = Math.floor(((event.clientY - bounds.top) / bounds.height) * gridHeight);
    setHoveredColor(cells[y * grid + x] ?? null);
  };
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = formatMessage(messages.imageFileName, {
      name: fileName.replace(/\.[^.]+$/, "") || messages.defaultFileName,
      width: grid,
      height: gridHeight,
    });
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  const downloadUsage = () => {
    const rows = [messages.csvHeaders, ...selectedPalette.flatMap((swatch, index) => counts[index] ? [[brand, swatch.code, swatch.name, swatch.hex, String(counts[index])]] : [])];
    const blob = new Blob([`\uFEFF${rows.map((row) => row.join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = formatMessage(messages.colorsFileName, {
      name: fileName.replace(/\.[^.]+$/, "") || messages.defaultFileName,
    });
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="converter-toolbar">
        <strong>{messages.toolbarTitle}</strong>
        <div className="converter-toolbar-actions">
          <a className="converter-create-action" href="/editor">{messages.designer} <span aria-hidden="true">→</span></a>
          {fileUrl && <button type="button" onClick={() => { setFileUrl(null); setCells([]); setHoveredColor(null); }}><X size={15} /> {messages.discard}</button>}
        </div>
      </div>
      <div className="studio-grid">
        <section className={`preview-workspace ${fileUrl ? "has-file" : "is-empty"}`}>
          {fileUrl ? <>
            <div className="source-strip"><img src={fileUrl} alt={messages.selectedSourceAlt} /><div><strong>{fileName}</strong><span>{formatMessage(messages.processed, { width: grid, height: gridHeight })}</span></div><button type="button" onClick={() => inputRef.current?.click()}><RefreshCw size={15} /> {messages.replace}</button></div>
            <div className={`pattern-preview ${hoveredColor !== null ? "is-color-hover" : ""}`}><div className="preview-label"><Grid3X3 size={15} /> {hoveredColor !== null ? formatMessage(messages.hoverLabel, { brand, code: selectedPalette[hoveredColor].code, name: selectedPalette[hoveredColor].name, count: counts[hoveredColor] }) : formatMessage(messages.previewLabel, { width: grid, height: gridHeight })}</div><canvas ref={canvasRef} aria-label={messages.canvasLabel} onMouseMove={handleCanvasHover} onMouseLeave={() => setHoveredColor(null)} /></div>
          </> : <div className={`upload-zone ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
            <div className="upload-icon"><ImagePlus size={28} /></div><h3>{messages.uploadTitle}</h3><p>{messages.uploadDescription}</p>
            <button type="button" className="primary-button" onClick={() => inputRef.current?.click()}>{messages.chooseImage} <span aria-hidden="true">→</span></button>
          </div>}
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])} />
        </section>
        <aside className="controls-card">
          <div className="brand-choice"><label htmlFor="bead-brand">{messages.beadCollection}</label><select id="bead-brand" value={brand} onChange={(event) => { setCells([]); setHoveredColor(null); setBrand(event.target.value as PaletteBrand); }}>{paletteOptions.map((option) => <option value={option.value} key={option.value}>{option.value} ({formatMessage(messages.colors, { count: option.count })})</option>)}</select></div>
          <div className="control-block"><label htmlFor="grid-size">{messages.patternWidth} <strong>{formatMessage(messages.beads, { count: grid })}</strong></label><input id="grid-size" type="range" min="16" max="58" step="1" value={grid} onChange={(event) => setGrid(Number(event.target.value))} /><div className="range-ends"><span>{formatMessage(messages.beads, { count: 16 })}</span><span>{formatMessage(messages.beads, { count: 58 })}</span></div></div>
          <div className="control-block"><label htmlFor="color-count">{messages.colorLimit} <strong>{formatMessage(messages.colors, { count: maxColors })}</strong></label><input id="color-count" type="range" min="4" max="24" value={maxColors} onChange={(event) => setMaxColors(Number(event.target.value))} /><div className="range-ends"><span>{messages.simple}</span><span>{messages.detailed}</span></div></div>
          <div className="quick-options">
            <label><span>{messages.background}</span><select value={backgroundMode} onChange={(event) => setBackgroundMode(event.target.value as "keep" | "remove-light")}><option value="keep">{messages.keepBackground}</option><option value="remove-light">{messages.removeBackground}</option></select></label>
            <div className="option-row"><span>{messages.beadShape}</span><div className="segmented"><button className={beadShape === "pixel" ? "active" : ""} onClick={() => setBeadShape("pixel")}>{messages.square}</button><button className={beadShape === "bead" ? "active" : ""} onClick={() => setBeadShape("bead")}>{messages.round}</button></div></div>
            <div className="toggle-row"><label><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /> {messages.grid}</label><label><input type="checkbox" checked={showCodes} onChange={(event) => setShowCodes(event.target.checked)} /> {messages.colorCodes}</label></div>
          </div>
          {fileUrl ? <div className="usage-compact"><div><strong>{formatMessage(messages.colorList, { brand })}</strong><span>{formatMessage(messages.usageSummary, { colors: activePalette.length, beads: totalBeads })}</span></div><div className="usage-scroll">{selectedPalette.map((swatch, index) => counts[index] > 0 && <div className="usage-row" key={swatch.code}><i style={{ background: swatch.hex }} /><b>{swatch.code}</b><span>{swatch.name}</span><em>{counts[index]}</em></div>)}</div></div> : <p className="hint"><RefreshCw size={14} /> {messages.emptyHint}</p>}
          <div className="export-actions"><button className="primary-button full" onClick={download} disabled={!fileUrl}><Download size={17} /> {messages.exportImage}</button><button className="secondary-button full" onClick={downloadUsage} disabled={!fileUrl}><FileSpreadsheet size={16} /> {messages.exportColors}</button></div>
          {fileUrl && <a className="full-editor-link" href="/editor">{messages.openEditor} <ExternalLink size={14} /></a>}
        </aside>
      </div>
    </>
  );
}
