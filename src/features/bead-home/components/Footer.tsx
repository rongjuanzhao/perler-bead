import type { HomeMessages } from "../messages/types";
import { formatMessage } from "../messages/format";

export default function Footer({ brandName, messages }: { brandName: string; messages: HomeMessages["footer"] }) {
  const [accentName, ...baseName] = brandName.split(" ");

  return (
    <footer id="about">
      <a className="bead-brand" href="#quick-studio" aria-label={messages.homeLabel}>
        <img src="/perlerbeadmake-mark.svg" alt="" />
        <span className="bead-brand-name"><span>{accentName}</span>{baseName.length > 0 && <b>{baseName.join(" ")}</b>}</span>
      </a>
      <p>{messages.tagline}</p>
      <span>{formatMessage(messages.copyright, { year: new Date().getFullYear() })}</span>
    </footer>
  );
}
