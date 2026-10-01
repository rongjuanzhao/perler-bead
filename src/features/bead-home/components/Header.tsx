import type { HomeMessages } from "../messages/types";

export default function Header({ messages }: { messages: HomeMessages["header"] }) {
  return (
    <nav className="bead-nav" aria-label={messages.navigationLabel}>
      <a className="bead-brand" href="#quick-studio" aria-label={messages.homeLabel}>
        <img src="/perlerbeadmake-logo.svg" alt={messages.homeLabel} />
      </a>
      <div className="bead-nav-links">
        <a href="#templates-title">{messages.templates}</a>
        <a href="#how">{messages.howItWorks}</a>
        <a href="#palette">{messages.palette}</a>
        <a href="#faq-title">{messages.questions}</a>
      </div>
    </nav>
  );
}
