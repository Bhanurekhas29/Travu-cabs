import { useEffect, useRef, useState } from "react";
import { getSectionHeadings, getSiteSettings, getVehicleTypes } from "../api/client";
import FareEstimator from "./FareEstimator";
import useScrollReveal from "../hooks/useScrollReveal";
import "./RideOptions.css";

function formatRupees(value) {
  return Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function whatsappLink(whatsappNumber, vehicleName) {
  const message = encodeURIComponent(
    `Hi! I'm interested in booking the ${vehicleName}. Could you share more details?`
  );
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

function VehicleCard({ vehicle, whatsappNumber, onBook }) {
  return (
    <article className="ride-card">
      <div className="ride-card__topbar">
        <div className="ride-card__topbar-left">
          {vehicle.badge && <span className="ride-card__badge">{vehicle.badge}</span>}
          {vehicle.ideal_for && <span>{vehicle.ideal_for}</span>}
        </div>
        {vehicle.availability_text && (
          <div className="ride-card__availability">
            <span className="ride-card__availability-dot" />
            {vehicle.availability_text}
          </div>
        )}
      </div>

      <div className="ride-card__body">
        <div className="ride-card__image">
          {vehicle.image ? (
            <img src={vehicle.image} alt={vehicle.name} />
          ) : (
            <span className="material-icons" aria-hidden="true">directions_car</span>
          )}
          {vehicle.image_badge_text && (
            <span className="ride-card__image-badge">{vehicle.image_badge_text}</span>
          )}
        </div>

        <div className="ride-card__details">
          <div className="ride-card__name-row">
            <h3 className="ride-card__name">{vehicle.name}</h3>
            {vehicle.rating && (
              <span className="ride-card__rating">
                <span className="material-icons" aria-hidden="true">star</span>
                {vehicle.rating}
                {vehicle.review_count ? (
                  <span className="ride-card__review-count"> ({vehicle.review_count})</span>
                ) : (
                  ""
                )}
              </span>
            )}
          </div>

          {vehicle.description && <p className="ride-card__description">{vehicle.description}</p>}

          <div className="ride-card__features">
            <span>
              <span className="material-icons" aria-hidden="true">event_seat</span>
              {vehicle.seating_capacity}+1 Seater
            </span>
            {vehicle.luggage_capacity && (
              <span>
                <span className="material-icons" aria-hidden="true">luggage</span>
                {vehicle.luggage_capacity}
              </span>
            )}
            {vehicle.has_ac && (
              <span>
                <span className="material-icons" aria-hidden="true">ac_unit</span>
                Climate AC
              </span>
            )}
            {vehicle.has_audio_usb && (
              <span>
                <span className="material-icons" aria-hidden="true">usb</span>
                Audio &amp; USB
              </span>
            )}
          </div>

          {(vehicle.local_rate || vehicle.outstation_rate || vehicle.per_km_rate) && (
            <div className="ride-card__pricing">
              {vehicle.local_rate && (
                <div>
                  <span className="ride-card__price-label">Local Half Day</span>
                  <span className="ride-card__price-value">&#8377;{formatRupees(vehicle.local_rate)}</span>
                  {vehicle.local_rate_note && (
                    <span className="ride-card__price-note">{vehicle.local_rate_note}</span>
                  )}
                </div>
              )}
              {vehicle.outstation_rate && (
                <div>
                  <span className="ride-card__price-label">Full Day Sightseeing</span>
                  <span className="ride-card__price-value ride-card__price-value--highlight">
                    &#8377;{formatRupees(vehicle.outstation_rate)}
                  </span>
                  {vehicle.outstation_rate_note && (
                    <span className="ride-card__price-note">{vehicle.outstation_rate_note}</span>
                  )}
                </div>
              )}
              {vehicle.per_km_rate && (
                <div>
                  <span className="ride-card__price-label">Outstation Rate</span>
                  <span className="ride-card__price-value">&#8377;{formatRupees(vehicle.per_km_rate)}/km</span>
                  {vehicle.driver_allowance && (
                    <span className="ride-card__price-note">
                      Bata &#8377;{formatRupees(vehicle.driver_allowance)}/day
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="ride-card__actions">
            <button type="button" className="btn btn--dark" onClick={() => onBook(vehicle)}>
              <span className="material-icons" aria-hidden="true">calendar_month</span>
              Book {vehicle.name}
            </button>
            {whatsappNumber && (
              <a
                href={whatsappLink(whatsappNumber, vehicle.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp"
              >
                <span className="material-icons" aria-hidden="true">chat</span>
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

const CARD_GAP = 20;

function VehicleVerticalCarousel({ vehicles, whatsappNumber, onBook, matchHeight }) {
  const [index, setIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const firstCard = trackRef.current?.querySelector(".ride-card");
    if (firstCard) setCardHeight(firstCard.offsetHeight);
  }, [vehicles]);

  const step = cardHeight + CARD_GAP;
  const maxIndex = Math.max(vehicles.length - 1, 0);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, maxIndex));

  return (
    <div className="ride-carousel-v" style={matchHeight ? { height: matchHeight } : undefined}>
      <div className="ride-carousel-v__viewport">
        <div
          className="ride-carousel-v__track"
          ref={trackRef}
          style={{ transform: `translateY(-${index * step}px)` }}
        >
          {vehicles.map((v) => (
            <div className="ride-carousel-v__item" key={v.id}>
              <VehicleCard vehicle={v} whatsappNumber={whatsappNumber} onBook={onBook} />
            </div>
          ))}
        </div>
      </div>
      <div className="ride-carousel-v__nav">
        <button type="button" onClick={goPrev} disabled={index === 0} aria-label="Previous vehicle">
          <span className="material-icons" aria-hidden="true">expand_less</span>
        </button>
        <button type="button" onClick={goNext} disabled={index === maxIndex} aria-label="Next vehicle">
          <span className="material-icons" aria-hidden="true">expand_more</span>
        </button>
      </div>
    </div>
  );
}

function RideOptions({ onBookVehicle }) {
  const [heading, setHeading] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [sidebarHeight, setSidebarHeight] = useState(null);
  const sidebarRef = useRef(null);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getSectionHeadings()
      .then((data) => setHeading(data.find((h) => h.section_key === "choose_ride")))
      .catch(console.error);
    getVehicleTypes().then(setVehicles).catch(console.error);
    getSiteSettings().then(setSiteSettings).catch(console.error);
  }, []);

  useEffect(() => {
    if (!sidebarRef.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      setSidebarHeight(entry.contentRect.height);
    });
    observer.observe(sidebarRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="rides" className="ride-options">
      <div className="container">
        {heading && (
          <div
            ref={revealRef}
            className={`ride-options__heading reveal ${revealVisible ? "reveal-visible" : ""}`}
          >
            <p className="ride-options__eyebrow">A Ride For Every Plan</p>
            <h2>{heading.heading}</h2>
            {heading.subtext && <p className="ride-options__subtext">{heading.subtext}</p>}
          </div>
        )}

        <div className="ride-options__layout">
          <VehicleVerticalCarousel
            vehicles={vehicles}
            whatsappNumber={siteSettings?.whatsapp_number}
            onBook={onBookVehicle}
            matchHeight={sidebarHeight}
          />

          <div ref={sidebarRef}>
            <FareEstimator vehicles={vehicles} siteSettings={siteSettings} onBookVehicle={onBookVehicle} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default RideOptions;
