import type { HomeMessages } from "../messages/types";

export default function Hero({ messages }: { messages: HomeMessages["hero"] }) {
  return (
    <div className="panel-heading">
      <img className="panel-rainbow" src="/bead-rainbow.webp" alt={messages.rainbowAlt} />
      <div className="panel-title-copy">
        <h1>{messages.title}</h1>
        <p>
          {messages.descriptionBefore} <strong>{messages.descriptionHighlight}</strong>{" "}
          {messages.descriptionAfter}
        </p>
        <div className="panel-benefits" aria-label={messages.benefitsLabel}>
          {messages.benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}
        </div>
      </div>
      <img className="panel-star" src="/bead-star.webp" alt={messages.starAlt} />
    </div>
  );
}
