import "./Hero.css";

function Hero({ hero, siteSettings }) {
  if (!hero) return null;

  const image = hero.background_image;

  return (
    <section id="top" className="hero">
      {image && <div className="hero__bg" style={{ backgroundImage: `url(${image})` }} />}
      <div className="hero__overlay" />

      <div className="container hero__inner">
        {siteSettings?.unit_of_text && (
          <a href="https://www.blueholidaysindia.in/" target="_blank" rel="noopener noreferrer" className="hero__unit-of">
            {siteSettings.brand_name || "Travu"} - {siteSettings.unit_of_text}
          </a>
        )}
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-line" aria-hidden="true"></span>
          Every road, made effortless.
        </p>
        <h1 className="hero__heading">
          {hero.heading_line1}
          <br />
          <span className="hero__heading-highlight">{hero.heading_line2}</span>
        </h1>
        {hero.subtext && <p className="hero__subtext">{hero.subtext}</p>}

        <div className="hero__actions">
          {hero.button1_text && (
            <a href={hero.button1_link || "#book"} className="btn btn--primary">
              {hero.button1_text}
              <span className="material-icons" aria-hidden="true">
                arrow_forward
              </span>
            </a>
          )}
          {hero.button2_text && (
            <a href={hero.button2_link || "#rides"} className="btn btn--outline">
              {hero.button2_text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
