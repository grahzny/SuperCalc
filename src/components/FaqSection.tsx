import type { FAQ } from "@/lib/types";

type Props = {
  title?: string;
  faqs: FAQ[];
};

export function FaqSection({ title = "Frequently asked questions", faqs }: Props) {
  return (
    <section aria-labelledby="faq-title" className="card">
      <h2 id="faq-title">{title}</h2>
      {faqs.map((faq) => (
        <details key={faq.question} className="faq-item">
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}
