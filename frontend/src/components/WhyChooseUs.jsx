import { useEffect, useState } from "react";
import { getWhyChooseUsFeatures, getWhyChooseUsSection } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./WhyChooseUs.css";

function WhyChooseUs() {
  const [section, setSection] = useState(null);
  const [features, setFeatures] = useState([]);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getWhyChooseUsSection().then(setSection).catch(console.error);
    getWhyChooseUsFeatures().then(setFeatures).catch(console.error);
  }, []);

  return (
    <section ref={revealRef} className={`why-choose-us reveal ${revealVisible ? "reveal-visible" : ""}`}>
      <div className="container why-choose-us__layout">
        <div className="why-choose-us__content">
          {section?.eyebrow && <p className="why-choose-us__eyebrow">{section.eyebrow}</p>}
          {section?.heading && <h2 className="why-choose-us__heading">{section.heading}</h2>}
          {section?.description && <p className="why-choose-us__description">{section.description}</p>}
          {section?.button_text && (
            <a href={section.button_link || "#book"} className="btn btn--primary why-choose-us__button">
              {section.button_text}
              <span className="material-icons" aria-hidden="true">arrow_forward</span>
            </a>
          )}
        </div>

        <div className="why-choose-us__features">
          {features.map((f) => (
            <div className="why-choose-us__feature" key={f.title}>
              <span className="why-choose-us__feature-icon">
                <span className="material-icons" aria-hidden="true">{f.icon}</span>
              </span>
              <span className="why-choose-us__feature-title">{f.title}</span>
              <span className="why-choose-us__feature-description">{f.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
