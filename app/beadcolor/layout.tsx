import Link from "next/link";
import Header from "@/src/features/bead-home/components/Header";
import { enMessages } from "@/src/features/bead-home/messages/en";
import styles from "@/src/features/beadcolor/BeadColor.module.css";

export default function BeadColorLayout({ children }: { children: React.ReactNode }) {
  return <div className="bead-shell"><Header brandName={enMessages.brandName} messages={enMessages.header} activePage="beadcolor" />{children}<div className={styles.footer}><Link href="/">perler bead maker</Link><span>Small beads. Big ideas.</span><Link href="/beadcolor">BeadColor</Link><Link href="/terms-of-service">Terms</Link><p>Independent color references. Brand names and trademarks belong to their respective owners.</p></div></div>;
}
