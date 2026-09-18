import { useMemo, useState } from "react";
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

  const approxHours = distanceKm ? (Number(distanceKm) / 40).toFixed(1) : null;

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
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
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
            <span>{distanceKm ? `${distanceKm} km • ~${approxHours} hrs` : "-"}</span>
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

        <button type="button" className="btn btn--dark fare-estimator__submit" onClick={handleBook} disabled={!selectedVehicle}>
          <span className="material-icons" aria-hidden="true">verified</span>
          Confirm &amp; Reserve with &#8377;0 Advance
        </button>
        <button
          type="button"
          className="btn btn--whatsapp fare-estimator__submit"
          onClick={handleWhatsappQuote}
          disabled={!siteSettings?.whatsapp_number}
        >
          <span className="material-icons" aria-hidden="true">chat</span>
          Send Quote to My WhatsApp
        </button>
        <p className="fare-estimator__note">
          <span className="material-icons" aria-hidden="true">lock</span>
          Free rescheduling up to 2 hours before pickup
        </p>
      </div>

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
    </aside>
  );
}

export default FareEstimator;
