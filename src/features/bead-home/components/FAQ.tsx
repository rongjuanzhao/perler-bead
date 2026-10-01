import type { HomeMessages } from "../messages/types";

export default function FAQ({ messages }: { messages: HomeMessages["faq"] }) {
  return (
    <section className="template-faq" id="faq" aria-labelledby="faq-title">
      <div className="template-faq-heading">
        <h2 id="faq-title">{messages.title}</h2>
        <p>{messages.description}</p>
      </div>
      <div className="template-faq-list">
        {messages.items.map((item) => (
          <details className="template-faq-item" key={item.question}>
            <summary><span>{item.question}</span><i aria-hidden="true" /></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
