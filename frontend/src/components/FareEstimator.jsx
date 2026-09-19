import { useEffect, useMemo, useState } from "react";
import "./FareEstimator.css";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function FareEstimator({ vehicles, siteSettings, onBookVehicle }) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [distanceKm, setDistanceKm] = useState("");

  const selectedVehicle = vehicles.find((v) => String(v.id) === String(vehicleId));

  const passengerError = useMemo(() => {
    if (!selectedVehicle || !passengers) return "";
    const count = Number(passengers);
    if (count < selectedVehicle.min_seats) {
      return `${selectedVehicle.name} needs at least ${selectedVehicle.min_seats} passenger${selectedVehicle.min_seats > 1 ? "s" : ""}.`;
    }
    if (count > selectedVehicle.max_seats) {
      return `${selectedVehicle.name} seats up to ${selectedVehicle.max_seats} passengers.`;
    }
    return "";
  }, [selectedVehicle, passengers]);

  useEffect(() => {
    if (!selectedVehicle) return;
    const count = Number(passengers) || 0;
    if (count < selectedVehicle.min_seats) {
      setPassengers(selectedVehicle.min_seats);
    } else if (count > selectedVehicle.max_seats) {
      setPassengers(selectedVehicle.max_seats);
    }
    // Only re-clamp when the selected vehicle changes, not on every keystroke -
    // that way the error message above can still show while the user types.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle]);

  const estimate = useMemo(() => {
    if (!selectedVehicle || !distanceKm || Number(distanceKm) <= 0) return null;
    const distance = Number(distanceKm);
    const perKm = Number(selectedVehicle.per_km_rate) || 0;
    const allowance = Number(selectedVehicle.driver_allowance) || 0;
    if (perKm > 0) {
      return distance * perKm + allowance;
    }
    if (selectedVehicle.local_rate) {
      return Number(selectedVehicle.local_rate);
    }
    return null;
  }, [selectedVehicle, distanceKm]);

  const approxHoursLow = distanceKm ? Math.floor(Number(distanceKm) / 40) : null;
  const approxHoursHigh = approxHoursLow !== null ? approxHoursLow + 1 : null;

  const handleBook = () => {
    if (selectedVehicle) onBookVehicle(selectedVehicle);
  };

  const handleWhatsappQuote = () => {
    if (!siteSettings?.whatsapp_number) return;
    const lines = [
      "Hi! I'd like a fare quote.",
      pickupLocation && `Pickup: ${pickupLocation}`,
      destination && `Destination: ${destination}`,
      selectedVehicle && `Vehicle: ${selectedVehicle.name}`,
      travelDate && `Date: ${travelDate}`,
      passengers && `Passengers: ${passengers}`,
      estimate && `Estimated Fare: Rs.${estimate.toFixed(2)}`,
    ].filter(Boolean);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${siteSettings.whatsapp_number}?text=${message}`, "_blank");
  };

  const dispatcherPhone = siteSettings?.secondary_phone_number || siteSettings?.primary_phone_number;

  return (
    <aside className="fare-estimator">
      <div className="fare-estimator__card">
        <div className="fare-estimator__header">
          <div>
            <p className="fare-estimator__eyebrow">Instant Calculation</p>
            <h3 className="fare-estimator__title">Live Fare Estimator</h3>
          </div>
          <span className="fare-estimator__header-icon material-icons" aria-hidden="true">calculate</span>
        </div>

        <div className="form-field">
          <label htmlFor="fe-pickup">Pickup Location</label>
          <div className="input-with-icon">
            <span className="material-icons" aria-hidden="true">near_me</span>
            <input
              id="fe-pickup"
              type="text"
              placeholder="City / Hotel / Station"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="fe-destination">Destination / Package</label>
          <div className="input-with-icon">
            <span className="material-icons" aria-hidden="true">location_on</span>
            <input
              id="fe-destination"
              type="text"
              placeholder="Sightseeing / Full Day / Drop"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="fe-vehicle">Select Vehicle Class</label>
          <div className="input-with-icon">
            <span className="material-icons" aria-hidden="true">directions_car</span>
            <select id="fe-vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="">Choose a vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          {selectedVehicle && (
            <span className="fare-estimator__field-hint">
              Seats {selectedVehicle.min_seats}
              {selectedVehicle.min_seats !== selectedVehicle.max_seats ? `-${selectedVehicle.max_seats}` : ""} passengers
            </span>
          )}
        </div>

        <div className="fare-estimator__row">
          <div className="form-field">
            <label htmlFor="fe-date">Travel Date</label>
            <input id="fe-date" type="date" min={todayStr()} value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="fe-passengers">Passengers</label>
            <input
              id="fe-passengers"
              type="number"
              min={selectedVehicle?.min_seats || 1}
              max={selectedVehicle?.max_seats}
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
            {passengerError && <span className="fare-estimator__field-error">{passengerError}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="fe-distance">Estimated Distance (km)</label>
          <input
            id="fe-distance"
            type="number"
            min="1"
            placeholder="e.g. 80"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
          />
        </div>

        <div className="fare-estimator__summary">
          <div className="fare-estimator__summary-row">
            <span>Estimated Distance / Duration</span>
            <span>{distanceKm ? `${distanceKm} km • ~${approxHoursLow}-${approxHoursHigh} hrs` : "-"}</span>
          </div>
          <div className="fare-estimator__summary-row">
            <span>Driver Bata &amp; Fuel</span>
            <span className="fare-estimator__included">Included</span>
          </div>
          <div className="fare-estimator__summary-row">
            <span>GST &amp; State Permit</span>
            <span className="fare-estimator__included">All Included</span>
          </div>
          <div className="fare-estimator__total-row">
            <span>Total Estimated Net Fare</span>
            <span className="fare-estimator__total">
              {estimate
                ? `₹${estimate.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "-"}
            </span>
          </div>
          <p className="fare-estimator__zero-advance">Zero advance required</p>
        </div>

        <button
          type="button"
          className="btn btn--dark fare-estimator__submit"
          onClick={handleBook}
          disabled={!selectedVehicle || !!passengerError}
        >
          <span className="material-icons" aria-hidden="true">verified</span>
          Confirm &amp; Reserve with &#8377;0 Advance
        </button>
        <button
          type="button"
          className="btn btn--whatsapp fare-estimator__submit"
          onClick={handleWhatsappQuote}
          disabled={!siteSettings?.whatsapp_number || !!passengerError}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28z" />
          </svg>
          Send Quote to My WhatsApp
        </button>
        <p className="fare-estimator__note">
          <span className="material-icons" aria-hidden="true">lock</span>
          Free rescheduling up to 2 hours before pickup
        </p>
      </div>

      {(siteSettings?.address || dispatcherPhone) && (
        <div className="fare-estimator__side">
          {siteSettings?.address && (
            <div className="fare-estimator__map">
              <iframe
                title="Our location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteSettings.address)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          {dispatcherPhone && (
            <div className="fare-estimator__dispatcher">
              <span className="material-icons fare-estimator__dispatcher-icon" aria-hidden="true">headset_mic</span>
              <p className="fare-estimator__dispatcher-eyebrow">Custom Itinerary?</p>
              <h4>Talk to Tour Dispatcher</h4>
              <p>
                Need customized multi-day pilgrimage routes or specialized multi-pickup corporate transport?
              </p>
              <a href={`tel:+91${dispatcherPhone}`} className="fare-estimator__dispatcher-call">
                Call +91 {dispatcherPhone}
              </a>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default FareEstimator;
