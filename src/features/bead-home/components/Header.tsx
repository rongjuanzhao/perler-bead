import type { HomeMessages } from "../messages/types";
import Link from "next/link";

export default function Header({ brandName, messages }: { brandName: string; messages: HomeMessages["header"] }) {
  const [accentName, ...baseName] = brandName.split(" ");

  return (
    <nav className="bead-nav" aria-label={messages.navigationLabel}>
      <Link className="bead-brand" href="/" aria-label={messages.homeLabel}>
        <img src="/perlerbeadmake-mark.svg" alt="" />
        <span className="bead-brand-name"><span>{accentName}</span>{baseName.length > 0 && <b>{baseName.join(" ")}</b>}</span>
      </Link>
      <div className="bead-nav-links">
        <div className="bead-nav-dropdown">
          <button type="button" className="bead-nav-toggle" aria-haspopup="true">
            Designers
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div className="bead-nav-menu">
            <Link href="/pixel-art">Pixel Art</Link>
            <Link href="/sprite-maker">Sprite Maker</Link>
            <Link href="/cross-stitch">Cross Stitch</Link>
          </div>
        </div>
        <Link href="/#templates-title">{messages.templates}</Link>
        <Link href="/#how">{messages.howItWorks}</Link>
        <Link href="/#palette">{messages.palette}</Link>
        <Link href="/#faq-title">{messages.questions}</Link>
      </div>
    </nav>
  );
}
