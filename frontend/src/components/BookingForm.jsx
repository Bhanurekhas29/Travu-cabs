import { useEffect, useState } from "react";
import { createBookingEnquiry, getVehicleTypes } from "../api/client";
import "./BookingForm.css";

const INITIAL_FORM = {
  pickup_location: "",
  destination: "",
  trip_type: "one_way",
  pickup_date: "",
  pickup_time: "",
  passengers: 1,
  vehicle_type: "",
  full_name: "",
  mobile_number: "",
  email: "",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function validate(form) {
  const errors = {};

  if (!form.pickup_location.trim()) errors.pickup_location = "Pickup location is required.";
  if (!form.destination.trim()) errors.destination = "Destination is required.";
  if (!form.pickup_date) {
    errors.pickup_date = "Pickup date is required.";
  } else if (form.pickup_date < todayStr()) {
    errors.pickup_date = "Pickup date cannot be in the past.";
  }
  if (!form.pickup_time) errors.pickup_time = "Pickup time is required.";
  if (!form.passengers || Number(form.passengers) < 1) errors.passengers = "At least 1 passenger is required.";

  const name = form.full_name.trim();
  if (!name) {
    errors.full_name = "Name is required.";
  } else if (name.length < 3) {
    errors.full_name = "Name must be at least 3 characters.";
  }

  const mobile = form.mobile_number.trim();
  if (!mobile) {
    errors.mobile_number = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(mobile)) {
    errors.mobile_number = "Enter a valid 10-digit mobile number.";
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function BookingForm({ preselectedVehicle }) {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    getVehicleTypes()
      .then((data) => setVehicleTypes(data.filter((v) => v.is_featured)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!preselectedVehicle) return;
    setForm((prev) => ({ ...prev, vehicle_type: preselectedVehicle.id }));
    setVehicleTypes((prev) =>
      prev.some((v) => v.id === preselectedVehicle.id) ? prev : [...prev, preselectedVehicle]
    );
  }, [preselectedVehicle]);

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleMobileChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, mobile_number: digitsOnly }));
    setErrors((prev) => ({ ...prev, mobile_number: undefined }));
  };

  const handlePassengerChange = (delta) => {
    setForm((prev) => ({ ...prev, passengers: Math.max(1, Number(prev.passengers) + delta) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createBookingEnquiry({
        ...form,
        vehicle_type: form.vehicle_type || null,
        passengers: Number(form.passengers),
      });
      setSuccessMessage("Your details have been submitted successfully!");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      if (err.fieldErrors) {
        const flatErrors = {};
        Object.entries(err.fieldErrors).forEach(([key, val]) => {
          flatErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(flatErrors);
      } else {
        setSubmitError("Something went wrong. Please try again or contact us directly.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="booking-form">
      <div className="container">
        <div className="booking-form__card">
          <div className="booking-form__header">
            <div>
              <p className="booking-form__eyebrow">Plan Your Journey</p>
              <h2 className="booking-form__title">Book Your Ride</h2>
            </div>
            <p className="booking-form__microcopy">Instant confirmation &middot; Verified drivers</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {(submitError || successMessage) && (
              <div className="booking-form__row">
                {submitError && <p className="booking-form__submit-error">{submitError}</p>}
                {successMessage && <p className="booking-form__success">{successMessage}</p>}
              </div>
            )}

            <div className="booking-form__row booking-form__row--triple">
              <div className="form-field">
                <label htmlFor="pickup_location">Pickup Location</label>
                <div className="input-with-icon">
                  <span className="material-icons" aria-hidden="true">near_me</span>
                  <input
                    id="pickup_location"
                    type="text"
                    placeholder="Enter pickup location"
                    value={form.pickup_location}
                    onChange={updateField("pickup_location")}
                  />
                </div>
                {errors.pickup_location && <span className="form-field__error">{errors.pickup_location}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="destination">Drop Location</label>
                <div className="input-with-icon">
                  <span className="material-icons" aria-hidden="true">location_on</span>
                  <input
                    id="destination"
                    type="text"
                    placeholder="Enter destination"
                    value={form.destination}
                    onChange={updateField("destination")}
                  />
                </div>
                {errors.destination && <span className="form-field__error">{errors.destination}</span>}
              </div>
              <div className="form-field">
                <label>Trip Type</label>
                <div className="booking-form__trip-type">
                  <button
                    type="button"
                    className={form.trip_type === "one_way" ? "is-active" : ""}
                    onClick={() => setForm((prev) => ({ ...prev, trip_type: "one_way" }))}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    className={form.trip_type === "round_trip" ? "is-active" : ""}
                    onClick={() => setForm((prev) => ({ ...prev, trip_type: "round_trip" }))}
                  >
                    Round Trip
                  </button>
                </div>
              </div>
            </div>

            <div className="booking-form__row booking-form__row--triple">
              <div className="form-field">
                <label htmlFor="pickup_date">Pickup Date</label>
                <div className="input-with-icon">
                  <span className="material-icons" aria-hidden="true">calendar_today</span>
                  <input
                    id="pickup_date"
                    type="date"
                    min={todayStr()}
                    value={form.pickup_date}
                    onChange={updateField("pickup_date")}
                  />
                </div>
                {errors.pickup_date && <span className="form-field__error">{errors.pickup_date}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="pickup_time">Pickup Time</label>
                <div className="input-with-icon">
                  <span className="material-icons" aria-hidden="true">schedule</span>
                  <input
                    id="pickup_time"
                    type="time"
                    value={form.pickup_time}
                    onChange={updateField("pickup_time")}
                  />
                </div>
                {errors.pickup_time && <span className="form-field__error">{errors.pickup_time}</span>}
              </div>
              <div className="form-field">
                <label>Passengers</label>
                <div className="booking-form__stepper">
                  <button type="button" onClick={() => handlePassengerChange(-1)} aria-label="Decrease passengers">
                    <span className="material-icons">remove</span>
                  </button>
                  <span>{form.passengers} Passenger{Number(form.passengers) > 1 ? "s" : ""}</span>
                  <button type="button" onClick={() => handlePassengerChange(1)} aria-label="Increase passengers">
                    <span className="material-icons">add</span>
                  </button>
                </div>
                {errors.passengers && <span className="form-field__error">{errors.passengers}</span>}
              </div>
            </div>

            <div className="booking-form__row booking-form__row--mixed">
              {vehicleTypes.length > 0 && (
                <div className="form-field booking-form__vehicle-field">
                  <label>Vehicle Type</label>
                  <div className="booking-form__vehicles">
                    {vehicleTypes.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        className={String(form.vehicle_type) === String(v.id) ? "is-active" : ""}
                        onClick={() => setForm((prev) => ({ ...prev, vehicle_type: v.id }))}
                      >
                        <span className="booking-form__vehicle-thumb">
                          {v.image ? (
                            <img src={v.image} alt="" />
                          ) : (
                            <span className="material-icons" aria-hidden="true">directions_car</span>
                          )}
                        </span>
                        <span className="booking-form__vehicle-label">{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-field">
                <label htmlFor="full_name">Full Name</label>
                <div className="input-with-icon">
                  <span className="material-icons" aria-hidden="true">person</span>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="Enter your name"
                    value={form.full_name}
                    onChange={updateField("full_name")}
                  />
                </div>
                {errors.full_name && <span className="form-field__error">{errors.full_name}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="mobile_number">Mobile Number</label>
                <div className="input-with-prefix">
                  <span className="input-with-prefix__prefix">+91</span>
                  <input
                    id="mobile_number"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    placeholder="Enter your mobile number"
                    value={form.mobile_number}
                    onChange={handleMobileChange}
                  />
                </div>
                {errors.mobile_number && <span className="form-field__error">{errors.mobile_number}</span>}
              </div>
            </div>

            <div className="booking-form__row booking-form__row--final">
              <div className="form-field">
                <label htmlFor="email">Email Address (Optional)</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={updateField("email")}
                />
                {errors.email && <span className="form-field__error">{errors.email}</span>}
              </div>

              <div className="booking-form__final-actions">
                <button type="submit" className="btn btn--dark booking-form__submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn--primary booking-form__submit"
                  onClick={() => document.getElementById("rides")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Search Available Cabs
                  <span className="material-icons" aria-hidden="true">arrow_forward</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default BookingForm;
