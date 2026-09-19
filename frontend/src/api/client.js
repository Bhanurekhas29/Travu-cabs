// VITE_API_BASE_URL is set per environment (frontend/.env for local dev,
// frontend/.env.production for the production build). In dev it's normally
// "http://localhost:8000/api" - but if the page itself was opened from a
// different host (e.g. a phone hitting the PC's LAN IP instead of
// "localhost"), swap in that same host so the API call actually reaches the
// backend instead of trying to call the phone itself.
function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    try {
      const configuredUrl = new URL(configured);
      const isLocalhost = ["localhost", "127.0.0.1"].includes(configuredUrl.hostname);
      const currentHost = window.location.hostname;
      if (isLocalhost && currentHost !== configuredUrl.hostname) {
        return `${window.location.protocol}//${currentHost}:${configuredUrl.port}${configuredUrl.pathname}`;
      }
    } catch {
      // configured value wasn't a valid absolute URL - fall through and use it as-is
    }
    return configured;
  }
  return "https://travu.in/api";
}

const API_BASE_URL = resolveApiBaseUrl();

export async function getSiteSettings() {
  const res = await fetch(`${API_BASE_URL}/site-settings/`);
  if (!res.ok) throw new Error("Failed to load site settings");
  return res.json();
}

export async function getHeroSection() {
  const res = await fetch(`${API_BASE_URL}/hero-section/`);
  if (!res.ok) throw new Error("Failed to load hero section");
  return res.json();
}

export async function getSectionHeadings() {
  const res = await fetch(`${API_BASE_URL}/section-headings/`);
  if (!res.ok) throw new Error("Failed to load section headings");
  return res.json();
}

export async function getHowItWorksSteps() {
  const res = await fetch(`${API_BASE_URL}/how-it-works-steps/`);
  if (!res.ok) throw new Error("Failed to load how it works steps");
  return res.json();
}

export async function getJourneyBanner() {
  const res = await fetch(`${API_BASE_URL}/journey-banner/`);
  if (!res.ok) throw new Error("Failed to load journey banner");
  return res.json();
}

export async function getFooterLinks() {
  const res = await fetch(`${API_BASE_URL}/footer-links/`);
  if (!res.ok) throw new Error("Failed to load footer links");
  return res.json();
}

export async function getCTASection() {
  const res = await fetch(`${API_BASE_URL}/cta-section/`);
  if (!res.ok) throw new Error("Failed to load CTA section");
  return res.json();
}

export async function getSafetySection() {
  const res = await fetch(`${API_BASE_URL}/safety-section/`);
  if (!res.ok) throw new Error("Failed to load safety section");
  return res.json();
}

export async function getSafetyPoints() {
  const res = await fetch(`${API_BASE_URL}/safety-points/`);
  if (!res.ok) throw new Error("Failed to load safety points");
  return res.json();
}

export async function getWhyChooseUsSection() {
  const res = await fetch(`${API_BASE_URL}/why-choose-us-section/`);
  if (!res.ok) throw new Error("Failed to load why choose us section");
  return res.json();
}

export async function getWhyChooseUsFeatures() {
  const res = await fetch(`${API_BASE_URL}/why-choose-us-features/`);
  if (!res.ok) throw new Error("Failed to load why choose us features");
  return res.json();
}

export async function getVehicleTypes() {
  const res = await fetch(`${API_BASE_URL}/vehicle-types/`);
  if (!res.ok) throw new Error("Failed to load vehicle types");
  return res.json();
}

export async function createBookingEnquiry(payload) {
  const res = await fetch(`${API_BASE_URL}/bookings/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error("Booking validation failed");
    error.fieldErrors = data;
    throw error;
  }
  return data;
}

export async function createContactMessage(payload) {
  const res = await fetch(`${API_BASE_URL}/contact-messages/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error("Contact message validation failed");
    error.fieldErrors = data;
    throw error;
  }
  return data;
}
