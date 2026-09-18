import "./FloatingActions.css";

function FloatingActions({ siteSettings }) {
  if (!siteSettings) return null;

  const { whatsapp_number: whatsappNumber, primary_phone_number: phone, email } = siteSettings;

  return (
    <div className="floating-actions">
      {email && (
        <a
          href={`mailto:${email}`}
          className="floating-actions__btn floating-actions__btn--email"
          aria-label="Email us"
        >
          <span className="material-icons" aria-hidden="true">email</span>
        </a>
      )}

      {phone && (
        <a
          href={`tel:+91${phone}`}
          className="floating-actions__btn floating-actions__btn--call"
          aria-label="Call us"
        >
          <span className="floating-actions__pulse" aria-hidden="true"></span>
          <span className="material-icons" aria-hidden="true">call</span>
        </a>
      )}

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-actions__btn floating-actions__btn--whatsapp"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.17c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.96-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28z" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default FloatingActions;
