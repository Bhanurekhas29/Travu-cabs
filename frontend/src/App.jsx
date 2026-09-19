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
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import { getHeroSection, getSiteSettings } from "./api/client";

function App() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [hero, setHero] = useState(null);
  const [preselectedVehicle, setPreselectedVehicle] = useState(null);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings).catch(console.error);
    getHeroSection().then(setHero).catch(console.error);
  }, []);

  const handleBookVehicle = (vehicle) => {
    setPreselectedVehicle(vehicle);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header siteSettings={siteSettings} />
      <main>
        <Hero hero={hero} siteSettings={siteSettings} />
        <BookingForm preselectedVehicle={preselectedVehicle} />
        <RideOptions onBookVehicle={handleBookVehicle} />
        <HowItWorks />
        <WhyChooseUs />
        <JourneyBanner />
        <SafetySection />
        <CTASection />
      </main>
      <Footer />
      <FloatingActions siteSettings={siteSettings} />
    </>
  );
}

export default App;
