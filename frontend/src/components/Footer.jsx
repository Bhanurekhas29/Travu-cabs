import { useEffect, useState } from "react";
import { getFooterLinks, getSiteSettings } from "../api/client";
import "./Footer.css";

const GROUP_LABELS = {
  quick_links: "Quick Links",
  ride_options: "Ride Options",
};

function Footer() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings).catch(console.error);
    getFooterLinks().then(setLinks).catch(console.error);
  }, []);

  const groups = ["quick_links", "ride_options"].map((key) => ({
    key,
    label: GROUP_LABELS[key],
    items: links.filter((l) => l.group_name === key),
  }));

  return (
    <footer className="footer" id="contact">
      <div className="container footer__layout">
        <div className="footer__brand">
          <a href="#top" className="footer__logo">
            {siteSettings?.logo ? (
              <img src={siteSettings.logo} alt={siteSettings.brand_name} />
            ) : (
              <span className="footer__logo-text">{siteSettings?.brand_name || "Travu"}</span>
            )}
          </a>
          {siteSettings?.address && (
            <>
              <h4 className="footer__address-heading">Address</h4>
              <p className="footer__address">{siteSettings.address}</p>
            </>
          )}
        </div>

        {groups.map(
          (group) =>
            group.items.length > 0 && (
              <div className="footer__group" key={group.key}>
                <h4>{group.label}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.url}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}

        <div className="footer__group">
          <h4>Contact</h4>
          <ul className="footer__contact-list">
            {siteSettings?.primary_phone_number && (
              <li>
                <a href={`tel:+91${siteSettings.primary_phone_number}`}>
                  <span className="material-icons" aria-hidden="true">call</span>
                  +91 {siteSettings.primary_phone_number}
                </a>
              </li>
            )}
            {siteSettings?.email && (
              <li>
                <a href={`mailto:${siteSettings.email}`}>
                  <span className="material-icons" aria-hidden="true">mail</span>
                  {siteSettings.email}
                </a>
              </li>
            )}
          </ul>

          {(siteSettings?.facebook_url || siteSettings?.instagram_url || siteSettings?.google_url) && (
            <div className="footer__social">
              {siteSettings.facebook_url && (
                <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <span className="material-icons" aria-hidden="true">facebook</span>
                </a>
              )}
              {siteSettings.instagram_url && (
                <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
                    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.25A3.25 3.25 0 1 1 12 8.75a3.25 3.25 0 0 1 0 6.5zm5.4-8.47a1.17 1.17 0 1 0 0-2.34 1.17 1.17 0 0 0 0 2.34z" />
                  </svg>
                </a>
              )}
              {siteSettings.google_url && (
                <a href={siteSettings.google_url} target="_blank" rel="noopener noreferrer" aria-label="Google">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.1A12 12 0 0 0 12 24z" />
                    <path fill="#FBBC05" d="M5.31 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.31v-3.1H1.3A12 12 0 0 0 0 12c0 1.93.46 3.76 1.3 5.41l4-3.1z" />
                    <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.59l4 3.1c.94-2.82 3.58-4.92 6.69-4.92z" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} {siteSettings?.brand_name || "Travu"} —{" "}
            <a href="https://www.blueholidaysindia.in/" target="_blank" rel="noopener noreferrer">
              A Unit of Blue Holidays
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
