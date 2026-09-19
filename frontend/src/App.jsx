import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BookingForm from "./components/BookingForm";
import RideOptions from "./components/RideOptions";
import HowItWorks from "./components/HowItWorks";
import WhyChooseUs from "./components/WhyChooseUs";
import JourneyBanner from "./components/JourneyBanner";
import SafetySection from "./components/SafetySection";
import CTASection from "./components/CTASection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import { getHeroSection, getSiteSettings } from "./api/client";

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [hero, setHero] = useState(null);
  const [preselectedVehicle, setPreselectedVehicle] = useState(null);
  const [prefillRoute, setPrefillRoute] = useState(null);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings).catch(console.error);
    getHeroSection().then(setHero).catch(console.error);
  }, []);

  const handleBookVehicle = (vehicle) => {
    setPreselectedVehicle(vehicle);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlanRoute = (pickup, destination) => {
    // A new object each time (even if the text is identical to last time)
    // so BookingForm's effect - keyed on this prop - fires on every submit.
    setPrefillRoute({ pickup, destination, key: Date.now() });
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header siteSettings={siteSettings} />
      <main>
        <Hero hero={hero} siteSettings={siteSettings} />
        <BookingForm preselectedVehicle={preselectedVehicle} prefillRoute={prefillRoute} />
        <RideOptions onBookVehicle={handleBookVehicle} />
        <HowItWorks />
        <WhyChooseUs />
        <JourneyBanner onPlanRoute={handlePlanRoute} />
        <SafetySection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
      <FloatingActions siteSettings={siteSettings} />
    </>
  );
}

export default App;
