import { useEffect, useState } from "react";
import { getHowItWorksSteps, getSectionHeadings } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./HowItWorks.css";

function HowItWorks() {
  const [heading, setHeading] = useState(null);
  const [steps, setSteps] = useState([]);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getSectionHeadings()
      .then((data) => setHeading(data.find((h) => h.section_key === "how_it_works")))
      .catch(console.error);
    getHowItWorksSteps().then(setSteps).catch(console.error);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={revealRef}
      className={`how-it-works reveal ${revealVisible ? "reveal-visible" : ""}`}
    >
      <div className="container">
        {heading && (
          <div className="how-it-works__heading">
            {heading.eyebrow && <p className="how-it-works__eyebrow">{heading.eyebrow}</p>}
            <h2>{heading.heading}</h2>
          </div>
        )}

        <div className="how-it-works__grid">
          {steps.map((step) => (
            <div className="how-it-works__card" key={step.step_number}>
              <p className="how-it-works__step-label">Step {String(step.step_number).padStart(2, "0")}</p>
              <div className="how-it-works__image">
                {step.image ? (
                  <img src={step.image} alt={step.title} />
                ) : (
                  <span className="material-icons" aria-hidden="true">directions_car</span>
                )}
              </div>
              <h3 className="how-it-works__title">{step.title}</h3>
              {step.description && <p className="how-it-works__description">{step.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
