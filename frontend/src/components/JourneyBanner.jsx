import { useEffect, useState } from "react";
import { getJourneyBanner } from "../api/client";
import useScrollReveal from "../hooks/useScrollReveal";
import "./JourneyBanner.css";

function JourneyBanner({ onPlanRoute }) {
  const [banner, setBanner] = useState(null);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getJourneyBanner().then(setBanner).catch(console.error);
  }, []);

  if (!banner) return null;

  const hasBackgroundImage = Boolean(banner.background_image);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlanRoute?.(pickup.trim(), destination.trim());
  };

  return (
    <section ref={revealRef} className={`journey-banner reveal ${revealVisible ? "reveal-visible" : ""}`}>
      {hasBackgroundImage && (
        <div className="journey-banner__bg" style={{ backgroundImage: `url(${banner.background_image})` }} />
      )}
      <div className="journey-banner__overlay" />
      <div className="container journey-banner__content">
        {banner.eyebrow && <p className="journey-banner__eyebrow">{banner.eyebrow}</p>}
        <h2 className="journey-banner__heading">{banner.heading}</h2>
        {banner.description && <p className="journey-banner__description">{banner.description}</p>}

        <form className="journey-banner__route" onSubmit={handleSubmit}>
          <div className="journey-banner__route-field">
            <span className="material-icons" aria-hidden="true">location_on</span>
            <input
              type="text"
              placeholder="Pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              aria-label="Pickup location"
            />
          </div>
          <div className="journey-banner__route-field">
            <span className="material-icons" aria-hidden="true">near_me</span>
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              aria-label="Destination"
            />
          </div>
          <button type="submit" className="journey-banner__route-submit" aria-label="Find your ride">
            <span className="material-icons" aria-hidden="true">arrow_forward</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default JourneyBanner;
