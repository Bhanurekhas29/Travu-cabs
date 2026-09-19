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

const VEHICLE_GROUP_ORDER = ["sedan", "suv", "premium", "van"];
const VEHICLE_GROUP_LABELS = { sedan: "Sedan", suv: "SUV", premium: "Premium", van: "Van" };

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// Within the chosen category (Sedan/SUV/Premium/Van), pick the specific
// vehicle that actually fits the passenger count - the smallest one whose
// seat range covers it, so the enquiry names a real, bookable vehicle
// instead of just the broad category.
function pickVehicleForCount(members, count) {
  const fits = members.filter((m) => count >= m.min_seats && count <= m.max_seats);
  if (fits.length > 0) {
    return fits.reduce((best, m) => (m.max_seats < best.max_seats ? m : best));
  }
  // No single vehicle's range covers this count - it falls in a gap
  // between tiers (e.g. 19-20 seats, when Urbania tops out at 16 and
  // Coach Van only starts at 21). Point at the next tier up that could
  // grow to fit it, so the error/hint tells the customer what they'd
  // actually need to book, instead of naming a vehicle too small for them.
  const nextUp = members
    .filter((m) => m.min_seats > count)
    .reduce((smallest, m) => (!smallest || m.min_seats < smallest.min_seats ? m : smallest), null);
  if (nextUp) return nextUp;
  // Bigger than every vehicle in the category - name the biggest one so
  // the error can say exactly how far over its limit the count is.
  return members.reduce((best, m) => (m.max_seats > best.max_seats ? m : best));
}

function validate(form, selectedVehicle, selectedGroup) {
  const errors = {};

  if (!form.pickup_location.trim()) errors.pickup_location = "Pickup location is required.";
  if (!form.destination.trim()) errors.destination = "Destination is required.";
  if (!form.pickup_date) {
    errors.pickup_date = "Pickup date is required.";
  } else if (form.pickup_date < todayStr()) {
    errors.pickup_date = "Pickup date cannot be in the past.";
  }
  if (!form.pickup_time) errors.pickup_time = "Pickup time is required.";
  if (!form.passengers || Number(form.passengers) < 1) {
    errors.passengers = "At least 1 passenger is required.";
  } else if (selectedVehicle) {
    const count = Number(form.passengers);
    if (count < selectedVehicle.min_seats) {
      errors.passengers = `${selectedVehicle.name} needs at least ${selectedVehicle.min_seats} passengers.`;
    } else if (count > selectedVehicle.max_seats) {
      errors.passengers = selectedGroup
        ? `Even our largest ${selectedGroup.label} (${selectedVehicle.name}) seats only ${selectedVehicle.max_seats} passengers.`
        : `${selectedVehicle.name} seats up to ${selectedVehicle.max_seats} passengers.`;
    }
  }

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

function BookingForm({ preselectedVehicle, prefillRoute }) {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    getVehicleTypes().then(setVehicleTypes).catch(console.error);
  }, []);

  const vehicleGroups = VEHICLE_GROUP_ORDER.map((key) => {
    const members = vehicleTypes.filter((v) => v.vehicle_group === key);
    if (members.length === 0) return null;
    return {
      key,
      label: VEHICLE_GROUP_LABELS[key],
      members,
      minSeats: Math.min(...members.map((m) => m.min_seats)),
      maxSeats: Math.max(...members.map((m) => m.max_seats)),
    };
  }).filter(Boolean);

  const selectedVehicle = vehicleTypes.find((v) => String(v.id) === String(form.vehicle_type));
  const selectedGroup = vehicleGroups.find((g) => g.key === selectedVehicle?.vehicle_group);

  useEffect(() => {
    if (!preselectedVehicle) return;
    setForm((prev) => {
      const count = Math.max(
        preselectedVehicle.min_seats,
        Math.min(preselectedVehicle.max_seats, Number(prev.passengers) || preselectedVehicle.min_seats)
      );
      return { ...prev, vehicle_type: preselectedVehicle.id, passengers: count };
    });
    setVehicleTypes((prev) =>
      prev.some((v) => v.id === preselectedVehicle.id) ? prev : [...prev, preselectedVehicle]
    );
    setErrors((prev) => ({ ...prev, passengers: undefined }));
  }, [preselectedVehicle]);

  useEffect(() => {
    if (!prefillRoute) return;
    setForm((prev) => ({
      ...prev,
      pickup_location: prefillRoute.pickup || prev.pickup_location,
      destination: prefillRoute.destination || prev.destination,
    }));
    setErrors((prev) => ({ ...prev, pickup_location: undefined, destination: undefined }));
  }, [prefillRoute]);

  const handleGroupSelect = (group) => {
    setForm((prev) => {
      const count = Math.max(group.minSeats, Math.min(group.maxSeats, Number(prev.passengers) || group.minSeats));
      const vehicle = pickVehicleForCount(group.members, count);
      return { ...prev, passengers: count, vehicle_type: vehicle.id };
    });
    setErrors((prev) => ({ ...prev, passengers: undefined }));
  };

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
    setForm((prev) => {
      let next = Number(prev.passengers) + delta;
      if (!selectedGroup) {
        return { ...prev, passengers: Math.max(1, next) };
      }
      next = Math.max(selectedGroup.minSeats, Math.min(selectedGroup.maxSeats, next));
      const vehicle = pickVehicleForCount(selectedGroup.members, next);
      return { ...prev, passengers: next, vehicle_type: vehicle.id };
    });
    setErrors((prev) => ({ ...prev, passengers: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setSubmitError("");

    const clientErrors = validate(form, selectedVehicle, selectedGroup);
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
                {selectedVehicle && !errors.passengers && (
                  <span className="form-field__hint">
                    We'll arrange: {selectedVehicle.name} ({selectedVehicle.min_seats}
                    {selectedVehicle.min_seats !== selectedVehicle.max_seats ? `-${selectedVehicle.max_seats}` : ""} seats)
                  </span>
                )}
                {errors.passengers && <span className="form-field__error">{errors.passengers}</span>}
              </div>
            </div>

            <div className="booking-form__row booking-form__row--mixed">
              {vehicleGroups.length > 0 && (
                <div className="form-field booking-form__vehicle-field">
                  <label>Vehicle Type</label>
                  <div className="booking-form__vehicles">
                    {vehicleGroups.map((g) => (
                      <button
                        type="button"
                        key={g.key}
                        className={selectedVehicle?.vehicle_group === g.key ? "is-active" : ""}
                        onClick={() => handleGroupSelect(g)}
                      >
                        <span className="booking-form__vehicle-thumb">
                          {g.members[0].image ? (
                            <img src={g.members[0].image} alt="" />
                          ) : (
                            <span className="material-icons" aria-hidden="true">directions_car</span>
                          )}
                        </span>
                        <span className="booking-form__vehicle-label">{g.label}</span>
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
