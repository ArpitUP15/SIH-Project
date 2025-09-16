import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Whyus from "./Whyus";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import FinalCtaPage from "./FinalCtaPage";
import Footer from "./Footer";
import Reviews from "./Reviews";

const HeroSectionLayout = ({
  homeRef,
  featureRef,
  testimonialRef,
  howItWorksRef,
  contactRef,
}) => {
  return (
    <div className="bg-gradient-to-b from-orange-500 via-bg-[#FFAE66] to-orange-300">
      <div className="">
        <Navbar
          homeRef={homeRef}
          featureRef={featureRef}
          testimonialRef={testimonialRef}
          howItWorksRef={howItWorksRef}
          contactRef={contactRef}
        />
        <div className="px-2">
          <div ref={homeRef}>
            <HeroSection />
          </div>
          <div className="">
            <Whyus />
            <div ref={howItWorksRef}>
              <HowItWorks />
            </div>
            <div ref={featureRef}>
              <Features />
            </div>
            <div ref={testimonialRef}>
              <Reviews />
            </div>
            <FinalCtaPage />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionLayout
