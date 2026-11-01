import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { colorLibraries, totalColorReferences, type ColorLibrary } from "./libraries";
import styles from "./BeadColor.module.css";

function LibraryCard({ library, index }: { library: ColorLibrary; index: number }) {
  const samples = Array.from({ length: 40 }, (_, i) => library.colors[Math.floor(i * (library.colors.length - 1) / 39)]);
  return <Link className={styles.card} href={`/beadcolor/${library.slug}`}>
    <div className={styles.cardArt} style={{ "--card-tint": ["#f6e8e0", "#e9ede3", "#e5eaf0", "#eee5ef", "#f1e9d7", "#e3eee9"][index % 6] } as CSSProperties}>
      <span className={styles.cardIndex}>COLOR LIBRARY / {String(index + 1).padStart(2, "0")}</span>
      <div className={styles.mosaic} aria-hidden="true">{samples.map((color, i) => <i key={i} style={{ background: color.hex }} />)}</div>
      <span className={styles.cardCount}>{library.colors.length}<small>COLORS</small></span>
    </div>
    <div className={styles.cardBody}><span className={styles.badge}>{library.reference}</span><h3>{library.name}<ArrowUpRight size={22} /></h3><span className={styles.series}>{library.series}</span><p>{library.description}</p><span className={styles.cardCta}>Explore color chart <ArrowRight size={16} /></span></div>
  </Link>;
}

export default function ColorCatalog() {
  return <main className={styles.catalog}>
    <section className={styles.hero}>
      <div><p className={styles.eyebrow}>BEADCOLOR / THE SWATCH LIBRARY</p><h1>Every little bead.<br /><em>A world of color.</em></h1><p className={styles.lead}>Find the colors for your next creation. Explore the bead libraries in our pattern maker, with original codes, HEX and RGB references.</p><a className={styles.primaryLink} href="#libraries">Find your color library <ArrowRight size={17} /></a></div>
      <div className={styles.heroArt} aria-hidden="true"><div className={styles.heroMosaic}>{Array.from({length: 64}, (_, i) => <i key={i} style={{background: colorLibraries[(i * 3) % 6].colors[(i * 17) % colorLibraries[(i * 3) % 6].colors.length].hex}} />)}</div><span>SMALL BEADS.<br />ENDLESS POSSIBILITIES.</span></div>
    </section>
    <div className={styles.stats}><span><b>{colorLibraries.length}</b> color libraries</span><span><b>{totalColorReferences.toLocaleString("en-US")}</b> color references</span><span>Original codes <i /> HEX <i /> RGB</span><p>One place for your next palette.</p></div>
    <section className={styles.librarySection} id="libraries"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>PICK YOUR BEADS</p><h2>A chart for every collection.</h2></div><p>Start with the brand and series you own.<br />Each library keeps its own color codes.</p></div><div className={styles.cardGrid}>{colorLibraries.filter(l => l.group === "brands").map((library, index) => <LibraryCard key={library.slug} library={library} index={index} />)}</div></section>
    <section className={styles.librarySection}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>THE MARD COLLECTIONS</p><h2>A little more room to create.</h2></div><p>221 standard colors, or the complete 291.<br />Choose the collection in your bead box.</p></div><div className={`${styles.cardGrid} ${styles.mardGrid}`}>{colorLibraries.filter(l => l.group === "mard").map((library, index) => <LibraryCard key={library.slug} library={library} index={index + 6} />)}</div></section>
    <section className={styles.notePanel}><div><p className={styles.eyebrow}>FROM SCREEN TO PEGBOARD</p><h2>A reference, bead by bead.</h2></div><div><p>Screen colors help you plan. Lighting, display settings, bead finish and production batches can change how a color looks. Check physical beads before choosing your supplies.</p><p>The total counts entries across libraries, including overlapping MARD colors. Similar shades across brands are not guaranteed substitutes.</p><Link href="/#quick-studio">Make a pattern with these colors <ArrowUpRight size={16} /></Link></div></section>
  </main>;
}
