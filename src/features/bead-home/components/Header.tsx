import type { HomeMessages } from "../messages/types";

export default function Header({ messages }: { messages: HomeMessages["header"] }) {
  return (
    <nav className="bead-nav" aria-label={messages.navigationLabel}>
      <a className="bead-brand" href="#quick-studio" aria-label={messages.homeLabel}>
        <img src="/beadloom-logo.svg" alt={messages.homeLabel} />
      </a>
      <div className="bead-nav-links">
        <a href="#how">{messages.howItWorks}</a>
        <a href="#palette">{messages.palette}</a>
        <a href="#about">{messages.about}</a>
      </div>
    </nav>
  );
}
