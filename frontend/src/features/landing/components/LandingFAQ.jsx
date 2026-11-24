import { faqs } from "../landingContent";

export default function LandingFAQ() {
  return (
    <section id="faq" className="landing-faq section-shell" aria-labelledby="faq-title">
      <div className="container-app faq-layout">
        <div><p className="eyebrow">A few useful details</p><h2 id="faq-title" className="section-heading">Frequently asked questions</h2></div>
        <div className="faq-list">
          {faqs.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </div>
    </section>
  );
}
