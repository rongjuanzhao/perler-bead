"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Download, Eraser, Grid3X3, PaintBucket, Pencil, Pipette, Redo2, RotateCcw, Undo2 } from "lucide-react";
import styles from "./CrossStitchDesigner.module.css";
import { DMC_COLORS, DMC_FAMILIES, DMC_FAMILY_NAME, DMC_INDEX, LEGEND_SYMBOLS } from "./dmc";
import { TEMPLATES, templateToCells, type CrossStitchTemplate } from "./templates";

type Tool = "pen" | "fill" | "picker" | "eraser";

type PrintEntry = { code: string; hex: string; symbol: string; count: number };
type PrintJob = { width: number; height: number; cells: (string | null)[]; entries: PrintEntry[] };

const MIN_SIZE = 4;
const MAX_SIZE = 100;
const RECENT_KEY = "cross-stitch-recent-colors";
const clampSize = (value: number) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)));
const blank = (width: number, height: number) => Array<string | null>(width * height).fill(null);

export default function CrossStitchDesigner() {
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(70);
  const [widthText, setWidthText] = useState("50");
  const [heightText, setHeightText] = useState("70");
  const [pixels, setPixels] = useState<(string | null)[]>(() => blank(50, 70));
  const [color, setColor] = useState("321");
  const [tool, setTool] = useState<Tool>("pen");
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<(string | null)[][]>([]);
  const [future, setFuture] = useState<(string | null)[][]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [printJob, setPrintJob] = useState<PrintJob | null>(null);
  const drawing = useRef(false);
  const studioRef = useRef<HTMLElement>(null);
  const colorChartRef = useRef<HTMLCanvasElement>(null);
  const symbolChartRef = useRef<HTMLCanvasElement>(null);

  const commit = useCallback((next: (string | null)[]) => {
    setPixels(current => {
      if (current.every((value, index) => value === next[index])) return current;
      setHistory(previous => [...previous.slice(-49), current]);
      setFuture([]);
      return next;
    });
  }, []);

  const resize = (nextWidth: number, nextHeight: number) => {
    const w = clampSize(nextWidth);
    const h = clampSize(nextHeight);
    if (w === width && h === height) return;
    // Stitches inside the overlapping region survive a dimension change so
    // tweaking the grid never wipes the design already on the canvas.
    const next = blank(w, h);
    for (let y = 0; y < Math.min(height, h); y += 1) for (let x = 0; x < Math.min(width, w); x += 1) next[y * w + x] = pixels[y * width + x];
    setPixels(next);
    setHistory([]);
    setFuture([]);
    setWidth(w);
    setHeight(h);
  };

  const selectColor = useCallback((code: string) => {
    setColor(code);
    setTool("pen");
    setRecent(list => Array.from(new Set([code, ...list])).slice(0, 12));
  }, []);

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
      const x = index % width;
      const y = Math.floor(index / width);
      if (x > 0) todo.push(index - 1);
      if (x < width - 1) todo.push(index + 1);
      if (y > 0) todo.push(index - width);
      if (y < height - 1) todo.push(index + width);
    }
    commit(next);
  };

  const paint = (index: number) => {
    if (tool === "picker") {
      const sampled = pixels[index];
      if (sampled) selectColor(sampled);
      return;
    }
    if (tool === "fill") { flood(index); return; }
    const value = tool === "eraser" ? null : color;
    if (pixels[index] === value) return;
    const next = [...pixels]; next[index] = value; commit(next);
  };

  const undo = useCallback(() => {
    if (!history.length) return;
    setHistory(history.slice(0, -1));
    setFuture([pixels, ...future]);
    setPixels(history[history.length - 1]);
  }, [history, future, pixels]);

  const redo = useCallback(() => {
    if (!future.length) return;
    setHistory([...history, pixels]);
    setFuture(future.slice(1));
    setPixels(future[0]);
  }, [history, future, pixels]);

  useEffect(() => {
    const release = () => { drawing.current = false; };
    window.addEventListener("pointerup", release);
    return () => window.removeEventListener("pointerup", release);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(RECENT_KEY);
      if (!saved) return;
      const codes = JSON.parse(saved);
      if (Array.isArray(codes)) setRecent(codes.filter((code): code is string => typeof code === "string").slice(0, 12));
    } catch { /* unreadable or unavailable storage — recent colors are optional */ }
  }, []);

  useEffect(() => {
    if (!recent.length) return;
    try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch { /* ignore */ }
  }, [recent]);

  // Tool shortcuts (P/F/I/E) and Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y, skipped while typing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (/^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName) || target.isContentEditable)) return;
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); return; }
      if ((event.ctrlKey || event.metaKey) && key === "y") { event.preventDefault(); redo(); return; }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (key === "p" || key === "b") setTool("pen");
      else if (key === "f") setTool("fill");
      else if (key === "i") setTool("picker");
      else if (key === "e") setTool("eraser");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const usage = useMemo(() => {
    const counts = new Map<string, number>();
    pixels.forEach(code => { if (code) counts.set(code, (counts.get(code) ?? 0) + 1); });
    return counts;
  }, [pixels]);

  const stitchTotal = useMemo(() => Array.from(usage.values()).reduce((sum, count) => sum + count, 0), [usage]);

  const requestExport = () => {
    if (!usage.size) return;
    const entries: PrintEntry[] = Array.from(usage.entries()).sort((a, b) => b[1] - a[1]).map(([code, count], index) => ({
      code, count,
      hex: DMC_INDEX.get(code)?.hex ?? "#ffffff",
      symbol: LEGEND_SYMBOLS[index % LEGEND_SYMBOLS.length],
    }));
    setPrintJob({ width, height, cells: pixels.slice(), entries });
  };

  const drawChart = (canvas: HTMLCanvasElement | null, job: PrintJob, mode: "color" | "symbol") => {
    if (!canvas) return;
    const scale = Math.max(8, Math.floor(1700 / Math.max(job.width, job.height)));
    canvas.width = job.width * scale + 1;
    canvas.height = job.height * scale + 1;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const symbols = new Map(job.entries.map(entry => [entry.code, entry.symbol]));
    job.cells.forEach((code, index) => {
      if (!code) return;
      const x = (index % job.width) * scale;
      const y = Math.floor(index / job.width) * scale;
      if (mode === "color") {
        context.fillStyle = DMC_INDEX.get(code)?.hex ?? "#fff";
        context.fillRect(x + 1, y + 1, scale - 1, scale - 1);
      } else {
        context.fillStyle = "#111";
        context.font = `${Math.floor(scale * 0.82)}px "Courier New", monospace`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(symbols.get(code) ?? "·", x + scale / 2, y + scale / 2 + 1);
      }
    });
    // Standard chart convention: a light rule per stitch, a heavy rule every ten.
    for (let x = 0; x <= job.width; x += 1) {
      context.strokeStyle = x % 10 === 0 ? "rgba(17,17,17,.8)" : "rgba(17,17,17,.28)";
      context.beginPath();
      context.moveTo(x * scale + .5, 0);
      context.lineTo(x * scale + .5, canvas.height);
      context.stroke();
    }
    for (let y = 0; y <= job.height; y += 1) {
      context.strokeStyle = y % 10 === 0 ? "rgba(17,17,17,.8)" : "rgba(17,17,17,.28)";
      context.beginPath();
      context.moveTo(0, y * scale + .5);
      context.lineTo(canvas.width, y * scale + .5);
      context.stroke();
    }
  };

  // The print sheet renders first, then the charts are drawn into its canvases
  // and the browser print dialog opens ("Save as PDF" produces the export).
  useEffect(() => {
    if (!printJob) return;
    drawChart(colorChartRef.current, printJob, "color");
    drawChart(symbolChartRef.current, printJob, "symbol");
    const clear = () => setPrintJob(null);
    window.addEventListener("afterprint", clear);
    window.print();
    return () => window.removeEventListener("afterprint", clear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printJob]);

  const commitDims = () => resize(Number(widthText) || width, Number(heightText) || height);

  const loadTemplate = (template: CrossStitchTemplate) => {
    const cells = templateToCells(template);
    setWidth(template.width);
    setHeight(template.height);
    setWidthText(String(template.width));
    setHeightText(String(template.height));
    setPixels(cells);
    setHistory([]);
    setFuture([]);
    setRecent(list => Array.from(new Set([...cells.filter((code): code is string => Boolean(code)), ...list])).slice(0, 12));
    studioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cellPx = Math.min(24, Math.max(4, Math.floor(560 / Math.max(width, height))));

  const cells = useMemo(() => pixels.map((code, index) => (
    <button key={index} aria-label={`Stitch ${index + 1}${code ? `, DMC ${code}` : ", empty"}`} className={styles.cell}
      style={{ backgroundColor: code ? DMC_INDEX.get(code)?.hex ?? "transparent" : "transparent" }}
      onPointerDown={(event) => { event.preventDefault(); drawing.current = true; paint(index); }}
      onPointerEnter={() => { if (drawing.current && tool !== "fill" && tool !== "picker") paint(index); }} />
  )), [pixels, tool, color]);

  const tools: { id: Tool; label: string; icon: ReactNode }[] = [
    { id: "pen", label: "Pen (P)", icon: <Pencil size={18} /> }, { id: "fill", label: "Fill (F)", icon: <PaintBucket size={18} /> },
    { id: "picker", label: "Pick (I)", icon: <Pipette size={18} /> }, { id: "eraser", label: "Erase (E)", icon: <Eraser size={18} /> },
  ];

  const query = search.trim().toLowerCase();
  const families = query
    ? DMC_FAMILIES.map(item => ({ ...item, colors: item.colors.filter(swatch => swatch.code.toLowerCase().includes(query)) })).filter(item => item.colors.length)
    : DMC_FAMILIES;
  const currentFamily = DMC_FAMILY_NAME.get(color);

  return <>
      <section className={styles.studio} aria-label="Cross stitch designer" ref={studioRef}>
        <div className={styles.topbar}><div><span>CROSS STITCH STUDIO</span><strong>{width} × {height} grid · {usage.size} {usage.size === 1 ? "color" : "colors"} · {stitchTotal} stitches</strong></div><div className={styles.actions}><button onClick={undo} disabled={!history.length} aria-label="Undo"><Undo2 size={17} /></button><button onClick={redo} disabled={!future.length} aria-label="Redo"><Redo2 size={17} /></button><button onClick={() => { if (window.confirm("Clear every stitch on this canvas?")) commit(blank(width, height)); }} aria-label="Clear canvas"><RotateCcw size={17} /></button><button className={styles.download} onClick={requestExport} disabled={!usage.size}><Download size={17} /> Export PDF</button></div></div>
        <div className={styles.workspace}>
          <aside className={styles.sidebar}>
            <div className={styles.panel}><h2>Canvas</h2>
              <div className={styles.dims}>
                <label>Width<input type="number" min={MIN_SIZE} max={MAX_SIZE} value={widthText} onChange={(e) => setWidthText(e.target.value)} onBlur={commitDims} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} inputMode="numeric" /></label>
                <label>Height<input type="number" min={MIN_SIZE} max={MAX_SIZE} value={heightText} onChange={(e) => setHeightText(e.target.value)} onBlur={commitDims} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} inputMode="numeric" /></label>
              </div>
              <div className={styles.presets}>
                <button onClick={() => resize(30, 30)}>30 × 30</button>
                <button onClick={() => resize(50, 70)}>50 × 70</button>
                <button onClick={() => resize(70, 70)}>70 × 70</button>
                <button onClick={() => resize(100, 100)}>100 × 100</button>
              </div>
              <button className={styles.gridToggle} onClick={() => setShowGrid(value => !value)}><Grid3X3 size={17} /> Grid <span>{showGrid ? "On" : "Off"}</span></button>
            </div>
            <div className={styles.panel}><h2>Tools</h2><div className={styles.toolGrid}>{tools.map(item => <button key={item.id} onClick={() => setTool(item.id)} className={tool === item.id ? styles.selected : ""}>{item.icon}<span>{item.label}</span></button>)}</div></div>
            <div className={styles.panel}><h2>DMC palette · {DMC_COLORS.length}</h2>
              <div className={styles.current}><i style={{ background: DMC_INDEX.get(color)?.hex ?? "#fff" }} /><div><code>{color}</code><small>{currentFamily ?? "DMC floss"}</small></div></div>
              {recent.length > 0 && <div className={styles.recents}><span>RECENT</span>{recent.map(code => <button key={code} title={code} aria-label={`Recent color ${code}`} style={{ background: DMC_INDEX.get(code)?.hex ?? "#fff" }} onClick={() => selectColor(code)} />)}</div>}
              <input className={styles.search} type="search" placeholder="Search DMC code…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search DMC color code" />
              <div className={styles.paletteList}>{families.map(item => (
                <div key={item.name} className={styles.family}><h3>{item.name}</h3><div className={styles.familySwatches}>{item.colors.map(swatch => (
                  <button key={swatch.code} title={swatch.code} aria-label={`DMC ${swatch.code}`} onClick={() => selectColor(swatch.code)} style={{ background: swatch.hex }} className={color === swatch.code ? styles.chosen : ""} />
                ))}</div></div>
              ))}</div>
            </div>
          </aside>
          <div className={styles.canvasArea}><div className={`${styles.canvas} ${showGrid ? styles.withGrid : ""}`} style={{ gridTemplateColumns: `repeat(${width}, ${cellPx}px)`, gridAutoRows: `${cellPx}px`, width: width * cellPx }}>{cells}</div><p><span style={{ background: DMC_INDEX.get(color)?.hex ?? "#fff" }} /> Current: DMC <b>{color}</b> · {tool === "pen" ? "Draw" : tool === "fill" ? "Fill connected stitches" : tool === "picker" ? "Sample a stitch" : "Erase to empty"}</p></div>
        </div>
      </section>
      <section className={styles.templates} aria-label="Starter templates">
        <span>TEMPLATES</span><h2>Start from a template</h2><p>Click a template to load it into the designer above.</p>
        <div className={styles.templateGrid}>{TEMPLATES.map(template => {
          const preview = templateToCells(template);
          return <button key={template.name} className={styles.templateCard} onClick={() => loadTemplate(template)} aria-label={`Load the ${template.name} template`}>
            <div className={styles.templatePreview} style={{ gridTemplateColumns: `repeat(${template.width}, 1fr)` }}>{preview.map((code, index) => <i key={index} style={{ background: code ? DMC_INDEX.get(code)?.hex ?? "transparent" : "transparent" }} />)}</div>
            <strong>{template.name}</strong><small>{template.width} × {template.height}</small>
          </button>;
        })}</div>
      </section>
    {printJob && createPortal(
      <div className={styles.printSheet}>
        <h1>Cross Stitch Chart</h1>
        <p className={styles.printMeta}>{printJob.width} × {printJob.height} stitches · {printJob.entries.length} colors · {stitchTotalOf(printJob)} stitches</p>
        <section className={styles.printSection}><h2>Color chart</h2><canvas ref={colorChartRef} /></section>
        <section className={styles.printSection}><h2>Symbol chart</h2><canvas ref={symbolChartRef} /></section>
        <section className={styles.printSection}><h2>Thread list</h2>
          <table><thead><tr><th>Symbol</th><th>Color</th><th>DMC</th><th>Stitches</th></tr></thead>
            <tbody>{printJob.entries.map(entry => (
              <tr key={entry.code}><td className={styles.printSymbol}>{entry.symbol}</td><td><span className={styles.printSwatch} style={{ background: entry.hex }} /></td><td>{entry.code}</td><td>{entry.count}</td></tr>
            ))}</tbody></table>
        </section>
      </div>,
      document.body
    )}
  </>;
}

function stitchTotalOf(job: PrintJob) {
  return job.entries.reduce((sum, entry) => sum + entry.count, 0);
}
