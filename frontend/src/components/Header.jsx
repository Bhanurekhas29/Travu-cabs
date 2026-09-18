import { useState } from "react";
import "./Header.css";

const NAV_LINKS = [
  { label: "Book a Ride", href: "#book" },
  { label: "Ride Options", href: "#rides" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Safety", href: "#safety" },
  { label: "Contact", href: "#contact" },
];

function Header({ siteSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const brandName = siteSettings?.brand_name || "Travu";

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="header__brand" onClick={closeMenu}>
          {siteSettings?.logo ? (
            <img src={siteSettings.logo} alt={brandName} className="header__logo" />
          ) : (
            <span className="header__brand-text">{brandName}</span>
          )}
        </a>

        <nav className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <ul className="header__nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#book" className="btn btn--primary header__nav-cta header__nav-cta--mobile" onClick={closeMenu}>
            Book Now
          </a>
        </nav>

        <a href="#book" className="btn btn--primary header__cta-desktop">
          Book Now
        </a>

        <button
          type="button"
          className="header__menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="material-icons">{isMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
