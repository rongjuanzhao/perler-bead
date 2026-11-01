"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, Search, X } from "lucide-react";
import type { BrandSwatch } from "@/src/components/bead-studio/brand-palettes";
import { colorLibraries, type ColorLibrary } from "./libraries";
import styles from "./BeadColor.module.css";

const families = ["All colors", "Yellow & orange", "Red & pink", "Green", "Blue & teal", "Purple", "Neutrals"];
function rgb(hex: string) { return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16)); }
function family(color: BrandSwatch) {
  if (color.transparent) return "Neutrals";
  const [r,g,b] = rgb(color.hex).map(v => v / 255), max = Math.max(r,g,b), min = Math.min(r,g,b), delta = max - min;
  if (delta < .09 || max < .19 || (max > .8 && delta < .16)) return "Neutrals";
  const hue = ((max === r ? (g-b)/delta : max === g ? (b-r)/delta+2 : (r-g)/delta+4) * 60 + 360) % 360;
  if (hue < 18 || hue >= 325) return "Red & pink";
  if (hue < 70) return "Yellow & orange";
  if (hue < 165) return "Green";
  if (hue < 265) return "Blue & teal";
  return "Purple";
}
function colorName(color: BrandSwatch) { return color.name.replace(/^MARD\s+/, ""); }

export default function ColorChart({ library }: { library: ColorLibrary }) {
  const [query, setQuery] = useState("");
  const [activeFamily, setActiveFamily] = useState("All colors");
  const [selectedCode, setSelectedCode] = useState(library.colors[0].code);
  const [copyStatus, setCopyStatus] = useState("");
  const [targetColor, setTargetColor] = useState("#ee6a55");
  const selected = library.colors.find(color => color.code === selectedCode) ?? library.colors[0];
  const filtered = useMemo(() => {
    const needle = query.toLowerCase().replace(/[\s,]/g, "");
    return library.colors.filter(color => (activeFamily === "All colors" || family(color) === activeFamily) && `${color.code} ${color.name} ${color.hex} ${rgb(color.hex).join(",")}`.toLowerCase().replace(/[\s,]/g, "").includes(needle));
  }, [query, activeFamily, library]);
  const values = rgb(selected.hex);
  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setCopyStatus(`${label} copied`); }
    catch { setCopyStatus("Copy unavailable. Select and copy the value above."); }
  }
  function download() {
    const data = { name: library.name, series: library.series, count: library.colors.length, reference: library.reference, source: library.source, note: library.note, colors: library.colors.map(color => ({code: color.code, name: color.name, hex: color.hex, rgb: rgb(color.hex), ...(color.transparent ? { transparency: "transparent", alpha: parseInt(color.hex.slice(7,9),16) / 255 } : {})})) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type: "application/json"}));
    const link = document.createElement("a"); link.href = url; link.download = `${library.slug}-palette.json`; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function findNearest(hex: string) {
    setTargetColor(hex);
    const target = rgb(hex);
    let nearest = library.colors[0], best = Infinity;
    for (const color of library.colors) {
      if (color.transparent) continue;
      const channels = rgb(color.hex);
      const distance = channels.reduce((sum, value, i) => sum + (value-target[i])**2 * [.3,.59,.11][i], 0);
      if (distance < best) { best = distance; nearest = color; }
    }
    setSelectedCode(nearest.code); setCopyStatus("");
  }
  return <main className={styles.chartPage}>
    <Link className={styles.backLink} href="/beadcolor"><ArrowLeft size={15} /> All color libraries</Link>
    <header className={styles.chartHero}><div><p className={styles.eyebrow}>BEADCOLOR / {library.series.toUpperCase()}</p><h1>{library.name}<em>color chart.</em></h1><p className={styles.lead}>Find your bead color. Browse {library.colors.length} references with original codes, HEX and RGB values.</p></div><span className={styles.referenceBadge}>{library.reference}<small>{library.colors.length} color references</small></span></header>
    <nav className={styles.libraryNav} aria-label="Color libraries">{colorLibraries.map(item => <Link key={item.slug} href={`/beadcolor/${item.slug}`} aria-current={item.slug === library.slug ? "page" : undefined}>{item.name}</Link>)}</nav>
    <div className={styles.chartLayout}>
      <section className={styles.colorBrowser} aria-label={`${library.name} colors`}>
        <div className={styles.searchBox}><Search size={19} /><input aria-label="Search colors" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search code, name, HEX or RGB…" />{query && <button aria-label="Clear search" onClick={()=>setQuery("")}><X size={16} /></button>}</div>
        <div className={styles.familyTabs} aria-label="Color families">{families.map(item => <button key={item} aria-pressed={activeFamily === item} onClick={()=>setActiveFamily(item)}>{item}</button>)}</div>
        <div className={styles.resultCount}><span>{filtered.length} / {library.colors.length} colors</span><span>Pick a swatch to explore</span></div>
        {filtered.length ? <div className={styles.colorGrid}>{filtered.map(color => <button className={styles.colorTile} key={color.code} aria-label={`${color.code} ${colorName(color)} ${color.hex}`} aria-pressed={selected.code === color.code} onClick={()=>{setSelectedCode(color.code);setCopyStatus("");}}><span className={styles.tileColor} style={{backgroundColor: color.hex}}>{color.transparent && <span className={styles.transparentMark}>Transparent</span>}{selected.code === color.code && <span className={styles.tileCheck}><Check size={13} /></span>}</span><strong>{color.code}</strong><small>{colorName(color) === color.code ? color.hex : colorName(color)}</small></button>)}</div> : <div className={styles.emptyState}><Search size={28} /><h2>No matching colors</h2><p>Try another code, name or color family.</p><button onClick={()=>{setQuery("");setActiveFamily("All colors");}}>Clear filters</button></div>}
        <p className={styles.filterNote}>Color families are browsing aids based on screen hue. Transparent finishes are display references.</p>
      </section>
      <aside className={styles.inspector} aria-label="Selected color">
        <p className={styles.eyebrow}>YOUR SELECTED COLOR</p>
        <div className={styles.largeSwatch}><div style={{background: selected.hex}} />{selected.transparent && <span>Transparent reference</span>}</div>
        <div className={styles.selectedHeading}><h2>{selected.code}</h2><span>{colorName(selected) !== selected.code ? colorName(selected) : library.name}</span></div>
        <dl className={styles.colorValues}><div><dt>HEX</dt><dd>{selected.hex}</dd></div><div><dt>RGB</dt><dd>{values.join(", ")}</dd></div><div><dt>COLLECTION</dt><dd>{library.series}</dd></div></dl>
        {selected.transparent && <p className={styles.transparentNote}>Display placeholder only. This color is excluded from automatic photo matching.</p>}
        <div className={styles.copyButtons}><button onClick={()=>copy(selected.code, "Code")}><Copy size={14}/> Copy code</button><button onClick={()=>copy(selected.hex, "HEX")}><Copy size={14}/> Copy HEX</button></div>
        <p className={styles.copyStatus} role="status">{copyStatus}</p>
        <div className={styles.nearest}><label htmlFor="nearest-color">Find a nearby screen color</label><div><input id="nearest-color" type="color" value={targetColor} onChange={e=>findNearest(e.target.value)} /><span>Choose a color to match<small>Searches the whole library</small></span></div></div>
        <button className={styles.downloadButton} onClick={download}><Download size={16}/> Download palette JSON</button>
        <Link className={styles.editorLink} href="/#quick-studio">Use in the pattern maker <ArrowUpRight size={15}/></Link>
      </aside>
    </div>
    <section className={styles.sourcePanel}><div><p className={styles.eyebrow}>THE LITTLE DETAILS</p><h2>Know your color reference.</h2></div><div><p>{library.note}</p><p>Screen colors vary by display, lighting and bead batch. Check the manufacturer’s current range and a physical color card before buying.</p><a href={library.source} target="_blank" rel="noreferrer">{library.sourceName} <ArrowUpRight size={15}/></a></div></section>
  </main>;
}
