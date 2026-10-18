"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Download, Eraser, Grid3X3, PaintBucket, Pencil, Pipette, Redo2, RotateCcw, Undo2 } from "lucide-react";
import styles from "./PixelArtStudio.module.css";

type Tool = "pen" | "fill" | "eraser" | "picker";

// A compact, intentionally stepped palette: six shades for each useful hue
// family keeps sprites easy to shade without making color choice overwhelming.
const PALETTE = [
  "#12172d", "#38415a", "#70798e", "#b9c0cb", "#edf0f4", "#ffffff",
  "#4c1520", "#96283a", "#d74b59", "#ee6a55", "#f69b96", "#ffe0dc",
  "#632d12", "#a94b1a", "#e06d25", "#f7a94b", "#ffd083", "#fff0d5",
  "#694815", "#b67b18", "#e0aa27", "#ffdf65", "#ffed9b", "#fff9d9",
  "#1f4a2a", "#357b3d", "#58a956", "#70bf6b", "#a0db8e", "#ddf2cf",
  "#15565d", "#208b91", "#35a9aa", "#60c9c5", "#9ce7de", "#d5f7ed",
  "#183a6b", "#2467ae", "#3286c8", "#63addf", "#9bd0ed", "#dceffd",
  "#41255e", "#684091", "#7755a5", "#a576c5", "#d2a5e1", "#f1dcf5",
];
const SIZES = [8, 16, 24, 32, 48, 64];
const blank = (size: number) => Array<string | null>(size * size).fill(null);

export default function PixelArtStudio() {
  const [size, setSize] = useState(32);
  const [pixels, setPixels] = useState<(string | null)[]>(() => blank(32));
  const [color, setColor] = useState("#ee6a55");
  const [tool, setTool] = useState<Tool>("pen");
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<(string | null)[][]>([]);
  const [future, setFuture] = useState<(string | null)[][]>([]);
  const drawing = useRef(false);

  const commit = useCallback((next: (string | null)[]) => {
    setPixels(current => {
      if (current.every((value, index) => value === next[index])) return current;
      setHistory(previous => [...previous.slice(-49), current]);
      setFuture([]);
      return next;
    });
  }, []);

  const resize = (nextSize: number) => {
    if (nextSize === size) return;
    const next = blank(nextSize);
    const limit = Math.min(size, nextSize);
    for (let y = 0; y < limit; y += 1) for (let x = 0; x < limit; x += 1) next[y * nextSize + x] = pixels[y * size + x];
    // History snapshots are tied to the dimensions of the grid. Start a fresh
    // history when the canvas changes shape so undo never restores a mismatched grid.
    setPixels(next);
    setHistory([]);
    setFuture([]);
    setSize(nextSize);
  };

  const flood = (start: number) => {
    const target = pixels[start];
    const replacement = tool === "eraser" ? null : color;
    if (target === replacement) return;
    const next = [...pixels];
    const todo = [start];
    while (todo.length) {
      const index = todo.pop()!;
      if (next[index] !== target) continue;
      next[index] = replacement;
      const x = index % size;
      const y = Math.floor(index / size);
      if (x > 0) todo.push(index - 1);
      if (x < size - 1) todo.push(index + 1);
      if (y > 0) todo.push(index - size);
      if (y < size - 1) todo.push(index + size);
    }
    commit(next);
  };

  const paint = (index: number) => {
    if (tool === "picker") { if (pixels[index]) { setColor(pixels[index]!); setTool("pen"); } return; }
    if (tool === "fill") { flood(index); return; }
    const value = tool === "eraser" ? null : color;
    if (pixels[index] === value) return;
    const next = [...pixels]; next[index] = value; commit(next);
  };

  const undo = () => {
    if (!history.length) return;
    const prior = history[history.length - 1];
    setHistory(items => items.slice(0, -1));
    setFuture(items => [pixels, ...items]);
    setPixels(prior);
  };
  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture(items => items.slice(1));
    setHistory(items => [...items, pixels]);
    setPixels(next);
  };

  useEffect(() => {
    const release = () => { drawing.current = false; };
    window.addEventListener("pointerup", release);
    return () => window.removeEventListener("pointerup", release);
  }, []);

  const exportPng = () => {
    const scale = Math.max(8, Math.floor(1024 / size));
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = size * scale;
    const context = canvas.getContext("2d")!;
    pixels.forEach((pixel, index) => {
      if (!pixel) return;
      context.fillStyle = pixel;
      context.fillRect((index % size) * scale, Math.floor(index / size) * scale, scale, scale);
    });
    const link = document.createElement("a"); link.download = "my-pixel-art.png"; link.href = canvas.toDataURL("image/png"); link.click();
  };

  const cells = useMemo(() => pixels.map((pixel, index) => (
    <button key={index} aria-label={`Pixel ${index + 1}${pixel ? `, ${pixel}` : ", transparent"}`} className={styles.cell}
      style={{ backgroundColor: pixel ?? "transparent" }}
      onPointerDown={(event) => { event.preventDefault(); drawing.current = true; paint(index); }}
      onPointerEnter={() => { if (drawing.current && tool !== "fill" && tool !== "picker") paint(index); }} />
  )), [pixels, tool, color]);

  const tools: { id: Tool; label: string; icon: ReactNode }[] = [
    { id: "pen", label: "Pen", icon: <Pencil size={18} /> }, { id: "fill", label: "Fill", icon: <PaintBucket size={18} /> },
    { id: "picker", label: "Pick", icon: <Pipette size={18} /> }, { id: "eraser", label: "Erase", icon: <Eraser size={18} /> },
  ];

  return <>
    <section id="pixel-art-editor" className={styles.studio} aria-label="Pixel art editor">
      <div className={styles.topbar}><div><span>PIXEL ART STUDIO</span><strong>{size} × {size} canvas</strong></div><div className={styles.actions}><button onClick={undo} disabled={!history.length} aria-label="Undo"><Undo2 size={17} /></button><button onClick={redo} disabled={!future.length} aria-label="Redo"><Redo2 size={17} /></button><button onClick={() => { if (window.confirm("Clear every pixel on this canvas?")) commit(blank(size)); }} aria-label="Clear canvas"><RotateCcw size={17} /></button><button className={styles.download} onClick={exportPng}><Download size={17} /> Export PNG</button></div></div>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.panel}><h2>Canvas</h2><label>Size<select value={size} onChange={(e) => resize(Number(e.target.value))}>{SIZES.map(value => <option key={value} value={value}>{value} × {value}</option>)}</select></label><button className={styles.gridToggle} onClick={() => setShowGrid(value => !value)}><Grid3X3 size={17} /> Grid <span>{showGrid ? "On" : "Off"}</span></button></div>
          <div className={styles.panel}><h2>Tools</h2><div className={styles.toolGrid}>{tools.map(item => <button key={item.id} onClick={() => setTool(item.id)} className={tool === item.id ? styles.selected : ""}>{item.icon}<span>{item.label}</span></button>)}</div></div>
          <div className={styles.panel}><h2>Color palette · {PALETTE.length}</h2><div className={styles.current}><input aria-label="Current color" type="color" value={color} onChange={(e) => setColor(e.target.value)} /><code>{color.toUpperCase()}</code></div><div className={styles.swatches}>{PALETTE.map(swatch => <button key={swatch} aria-label={`Select ${swatch}`} title={swatch.toUpperCase()} onClick={() => { setColor(swatch); setTool("pen"); }} style={{ background: swatch }} className={color === swatch ? styles.chosen : ""} />)}</div></div>
        </aside>
        <div className={styles.canvasArea}><div className={`${styles.canvas} ${showGrid ? styles.withGrid : ""}`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>{cells}</div><p><span style={{ background: color }} /> Current color: <b>{color.toUpperCase()}</b> · {tool === "pen" ? "Draw" : tool === "fill" ? "Fill connected pixels" : tool === "picker" ? "Sample a color" : "Erase to transparent"}</p></div>
      </div>
    </section>

  </>;
}
