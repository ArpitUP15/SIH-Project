import { Button } from "@/components/ui/button";
import e from "../assets/images/e.png"

const HeroSection = () => {
  return (
    <div className="mt-2">
      <div className="w-full relative py-5" style={{ backgroundImage: `url(${e})` }}>
        <div className="inset-0 absolute bg-[#fff] opacity-30"></div>
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-bold text-center text-4xl tracking-wide mt-[5rem]">
            Empowering Minds, Nuturing Futures
          </h1>
          <h1 className="font-bold mt-2 text-center text-4xl tracking-wide">
            Your Journey to Well-being Starts Here.
          </h1>
          <p className=" text-center mt-[6rem] px-12">
            MindSet is dedicated to providing comprehensive mental health
            support for higher education students. Discover personalized
            resources, connect with a supportive community, and build resilience
            for academic success and personal growth.
          </p>

          <div className="mt-[5rem] mx-auto flex items-center justify-center">
            <Button
              variant="sih"
              size="default"
              className="active:scale-[0.9] px-3 transition-all duration-100"
            >
              Get Started with MindSet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
