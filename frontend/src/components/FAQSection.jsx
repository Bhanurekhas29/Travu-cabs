import { useEffect, useState } from "react";
import { getFAQs } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./FAQSection.css";

function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getFAQs().then(setFaqs).catch(console.error);
  }, []);

  if (faqs.length === 0) return null;

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      id="faqs"
      ref={revealRef}
      className={`faq-section reveal ${revealVisible ? "reveal-visible" : ""}`}
    >
      <div className="container">
        <div className="faq-section__heading">
          <p className="faq-section__eyebrow">Got Questions?</p>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-section__list">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div className={`faq-item${isOpen ? " is-open" : ""}`} key={faq.id}>
                <button
                  type="button"
                  className="faq-item__question"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-item__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="faq-item__question-text">{faq.question}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    <span className="material-icons">add</span>
                  </span>
                </button>
                <div className="faq-item__answer-wrap">
                  <p className="faq-item__answer">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
