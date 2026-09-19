import { useEffect, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

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

          <button
            type="button"
            className="ride-card__toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Close details" : "View details"}
            <span className="material-icons" aria-hidden="true">
              {expanded ? "expand_less" : "expand_more"}
            </span>
          </button>

          <div className={`ride-card__collapsible ${expanded ? "is-expanded" : ""}`}>
            <div className="ride-card__collapsible-inner">
              {vehicle.description && <p className="ride-card__description">{vehicle.description}</p>}

              <div className="ride-card__features">
                <span>
                  <span className="material-icons" aria-hidden="true">event_seat</span>
                  {vehicle.min_seats === vehicle.max_seats
                    ? `${vehicle.min_seats}+1 Seater`
                    : `${vehicle.min_seats}-${vehicle.max_seats}+1 Seater`}
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
            </div>
          </div>

          <div className="ride-card__actions">
            <button type="button" className="btn btn--dark" onClick={() => onBook(vehicle)}>
              <span className="material-icons" aria-hidden="true">calendar_month</span>
              <span className="ride-card__btn-label-full">Book {vehicle.name}</span>
              <span className="ride-card__btn-label-short">Book</span>
            </button>
            {whatsappNumber && (
              <a
                href={whatsappLink(whatsappNumber, vehicle.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28z" />
                </svg>
                <span className="ride-card__btn-label-full">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function VehicleCarousel({ vehicles, whatsappNumber, onBook }) {
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(vehicles.length - 1, 0);
  const count = Math.max(vehicles.length, 1);
  const itemBasis = 100 / count;

  useEffect(() => {
    setIndex(0);
  }, [vehicles.length]);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, maxIndex));

  return (
    <div className="ride-carousel">
      <div className="ride-carousel__row">
        <button
          type="button"
          className="ride-carousel__arrow ride-carousel__arrow--prev"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous vehicle"
        >
          <span className="material-icons" aria-hidden="true">chevron_left</span>
        </button>

        <div className="ride-carousel__viewport">
          <div
            className="ride-carousel__track"
            style={{
              width: `${count * 100}%`,
              transform: `translateX(-${index * itemBasis}%)`,
            }}
          >
            {vehicles.map((v, i) => {
              // Each slide tilts a few degrees toward the direction it's
              // heading as it slides past - a subtle 3D wobble with no
              // peeking neighbours, so nothing can escape the clipped
              // viewport the way a true coverflow's overlapping cards did.
              const distance = Math.max(-1, Math.min(1, i - index));
              return (
                <div
                  className="ride-carousel__item"
                  key={v.id}
                  style={{
                    flexBasis: `${itemBasis}%`,
                    transform: `rotateY(${distance * -10}deg)`,
                  }}
                >
                  <VehicleCard vehicle={v} whatsappNumber={whatsappNumber} onBook={onBook} />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="ride-carousel__arrow ride-carousel__arrow--next"
          onClick={goNext}
          disabled={index === maxIndex}
          aria-label="Next vehicle"
        >
          <span className="material-icons" aria-hidden="true">chevron_right</span>
        </button>
      </div>
      <div className="ride-carousel__dots">
        {vehicles.map((v, i) => (
          <button
            type="button"
            key={v.id}
            className={i === index ? "is-active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Show ${v.name}`}
          />
        ))}
      </div>
    </div>
  );
}

function RideOptions({ onBookVehicle }) {
  const [heading, setHeading] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [revealRef, revealVisible] = useScrollReveal();

  useEffect(() => {
    getSectionHeadings()
      .then((data) => setHeading(data.find((h) => h.section_key === "choose_ride")))
      .catch(console.error);
    getVehicleTypes().then(setVehicles).catch(console.error);
    getSiteSettings().then(setSiteSettings).catch(console.error);
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

        <VehicleCarousel
          vehicles={vehicles}
          whatsappNumber={siteSettings?.whatsapp_number}
          onBook={onBookVehicle}
        />

        <div className="ride-options__estimator">
          <FareEstimator vehicles={vehicles} siteSettings={siteSettings} onBookVehicle={onBookVehicle} />
        </div>
      </div>
    </section>
  );
}

export default RideOptions;
