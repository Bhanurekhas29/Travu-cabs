import { useState } from "react";
import { createContactMessage } from "../api/client";
import "./ContactForm.css";

const INITIAL_FORM = {
  full_name: "",
  email: "",
  mobile_number: "",
  message: "",
};

function validate(form) {
  const errors = {};

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

  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 5) {
    errors.message = "Message is too short.";
  }

  return errors;
}

function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

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
      await createContactMessage(form);
      setSuccessMessage("Thanks! Your message has been sent - we'll get back to you shortly.");
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
    <div id="contact-form" className="contact-form">
      <div className="contact-form__header">
        <p className="contact-form__eyebrow">Get In Touch</p>
        <h3 className="contact-form__title">Send Us a Message</h3>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {(submitError || successMessage) && (
          <div className="contact-form__row">
            {submitError && <p className="contact-form__submit-error">{submitError}</p>}
            {successMessage && <p className="contact-form__success">{successMessage}</p>}
          </div>
        )}

        <div className="contact-form__row contact-form__row--split">
          <div className="form-field">
            <label htmlFor="contact-name">Full Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Enter your name"
              value={form.full_name}
              onChange={updateField("full_name")}
            />
            {errors.full_name && <span className="form-field__error">{errors.full_name}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="contact-mobile">Mobile Number</label>
            <div className="input-with-prefix">
              <span className="input-with-prefix__prefix">+91</span>
              <input
                id="contact-mobile"
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

        <div className="form-field">
          <label htmlFor="contact-email">Email Address (Optional)</label>
          <input
            id="contact-email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={updateField("email")}
          />
          {errors.email && <span className="form-field__error">{errors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="How can we help you?"
            value={form.message}
            onChange={updateField("message")}
          />
          {errors.message && <span className="form-field__error">{errors.message}</span>}
        </div>

        <button type="submit" className="btn btn--primary contact-form__submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
