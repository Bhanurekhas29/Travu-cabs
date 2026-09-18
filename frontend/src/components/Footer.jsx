import { useEffect, useState } from "react";
import { getFooterLinks, getSiteSettings } from "../api/client";
import "./Footer.css";

const GROUP_LABELS = {
  quick_links: "Quick Links",
  ride_options: "Ride Options",
  support: "Support",
};

function Footer() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings).catch(console.error);
    getFooterLinks().then(setLinks).catch(console.error);
  }, []);

  const groups = ["quick_links", "ride_options", "support"].map((key) => ({
    key,
    label: GROUP_LABELS[key],
    items: links.filter((l) => l.group_name === key),
  }));

  return (
    <footer className="footer">
      <div className="container footer__layout">
        <div className="footer__brand">
          <a href="#top" className="footer__logo">
            {siteSettings?.logo ? (
              <img src={siteSettings.logo} alt={siteSettings.brand_name} />
            ) : (
              <span className="footer__logo-text">{siteSettings?.brand_name || "Travu"}</span>
            )}
          </a>
          {siteSettings?.tagline && <p className="footer__tagline">{siteSettings.tagline}</p>}
          {siteSettings?.address && <p className="footer__address">{siteSettings.address}</p>}

          {(siteSettings?.facebook_url || siteSettings?.instagram_url) && (
            <div className="footer__social">
              {siteSettings.facebook_url && (
                <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <span className="material-icons" aria-hidden="true">facebook</span>
                </a>
              )}
              {siteSettings.instagram_url && (
                <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <span className="material-icons" aria-hidden="true">photo_camera</span>
                </a>
              )}
            </div>
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
                <a href={`tel:+91${siteSettings.primary_phone_number}`}>+91 {siteSettings.primary_phone_number}</a>
              </li>
            )}
            {siteSettings?.email && (
              <li>
                <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} {siteSettings?.brand_name || "Travu"}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
