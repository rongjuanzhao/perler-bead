import type { HomeMessages } from "../messages/types";
import { formatMessage } from "../messages/format";

export default function Footer({ messages }: { messages: HomeMessages["footer"] }) {
  return (
    <footer id="about">
      <a className="bead-brand" href="#quick-studio" aria-label={messages.homeLabel}>
        <img src="/beadloom-logo.svg" alt={messages.homeLabel} />
      </a>
      <p>{messages.tagline}</p>
      <span>{formatMessage(messages.copyright, { year: new Date().getFullYear() })}</span>
    </footer>
  );
}
