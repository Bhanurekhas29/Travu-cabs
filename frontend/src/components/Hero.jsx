import "./Hero.css";

function Hero({ hero }) {
  if (!hero) return null;

  const image1 = hero.background_image;
  const image2 = hero.background_image_2;
  const hasTwoImages = Boolean(image1 && image2);

  return (
    <section id="top" className="hero">
      {image1 && (
        <div
          className={`hero__bg ${hasTwoImages ? "hero__bg--fade-a" : ""}`}
          style={{ backgroundImage: `url(${image1})` }}
        />
      )}
      {hasTwoImages && (
        <div className="hero__bg hero__bg--fade-b" style={{ backgroundImage: `url(${image2})` }} />
      )}
      <div className="hero__overlay" />

      <div className="container hero__inner">
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
