import { useEffect, useState } from "react";
import { getJourneyBanner } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./JourneyBanner.css";

function JourneyBanner() {
  const [banner, setBanner] = useState(null);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getJourneyBanner().then(setBanner).catch(console.error);
  }, []);

  if (!banner) return null;

  const hasBackgroundImage = Boolean(banner.background_image);

  return (
    <section ref={revealRef} className={`journey-banner reveal ${revealVisible ? "reveal-visible" : ""}`}>
      {hasBackgroundImage && (
        <div className="journey-banner__bg" style={{ backgroundImage: `url(${banner.background_image})` }} />
      )}
      <div className="journey-banner__overlay" />
      <div className="container journey-banner__content">
        <p className="journey-banner__eyebrow">One City. Endless Routes.</p>
        <h2 className="journey-banner__heading">{banner.heading}</h2>

        <div className="journey-banner__route">
          <span className="journey-banner__route-point">
            <span className="material-icons" aria-hidden="true">location_on</span>
            Pickup
          </span>
          <span className="journey-banner__route-line" aria-hidden="true" />
          <span className="journey-banner__route-point journey-banner__route-point--end">
            Destination
            <span className="material-icons" aria-hidden="true">near_me</span>
          </span>
        </div>
      </div>
    </section>
  );
}

export default JourneyBanner;
