import type { HomeMessages } from "../messages/types";

export default function Steps({ messages }: { messages: HomeMessages["steps"] }) {
  return (
    <section className="template-process" id="how" aria-labelledby="process-title">
      <div className="template-process-heading">
        <h2 id="process-title">{messages.title}</h2>
        <p>{messages.description}</p>
      </div>
      <div className="template-process-steps">
        {messages.items.map((item) => (
          <article key={item.number}>
            <span className="template-step-number">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
