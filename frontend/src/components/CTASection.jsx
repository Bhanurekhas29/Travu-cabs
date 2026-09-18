import { useEffect, useState } from "react";
import { getCTASection } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./CTASection.css";

function CTASection() {
  const [cta, setCta] = useState(null);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getCTASection().then(setCta).catch(console.error);
  }, []);

  if (!cta) return null;

  return (
    <section ref={revealRef} className={`cta-section reveal ${revealVisible ? "reveal-visible" : ""}`}>
      <div className="container">
        <div className="cta-section__card">
          <div className="cta-section__content">
            <p className="cta-section__eyebrow">Your Next Ride Is Closer Than You Think</p>
            <h2 className="cta-section__heading">{cta.heading}</h2>
            {cta.description && <p className="cta-section__description">{cta.description}</p>}
            {cta.button_text && (
              <a href={cta.button_link || "#book"} className="btn btn--primary cta-section__button">
                {cta.button_text}
                <span className="material-icons" aria-hidden="true">arrow_forward</span>
              </a>
            )}
          </div>

          <div className="cta-section__image">
            {cta.image ? (
              <img src={cta.image} alt={cta.heading} />
            ) : (
              <span className="material-icons" aria-hidden="true">directions_car</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
