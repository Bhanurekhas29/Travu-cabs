import { useEffect, useState } from "react";
import { getSafetySection } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./SafetySection.css";

function SafetySection() {
  const [safety, setSafety] = useState(null);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getSafetySection().then(setSafety).catch(console.error);
  }, []);

  if (!safety) return null;

  return (
    <section
      id="safety"
      ref={revealRef}
      className={`safety-section reveal ${revealVisible ? "reveal-visible" : ""}`}
    >
      <div className="container safety-section__layout">
        <div className="safety-section__image-wrap">
          <div className="safety-section__image">
            {safety.image ? (
              <img src={safety.image} alt={safety.heading} />
            ) : (
              <span className="material-icons" aria-hidden="true">local_taxi</span>
            )}
          </div>
          {safety.badge_text && (
            <div className="safety-section__badge">
              <span className="safety-section__badge-icon">
                <span className="material-icons" aria-hidden="true">verified_user</span>
              </span>
              {safety.badge_text}
            </div>
          )}
        </div>

        <div className="safety-section__content">
          <p className="safety-section__eyebrow">Your Safety Comes First</p>
          <h2 className="safety-section__heading">{safety.heading}</h2>
          {safety.description && <p className="safety-section__description">{safety.description}</p>}
        </div>
      </div>
    </section>
  );
}

export default SafetySection;
