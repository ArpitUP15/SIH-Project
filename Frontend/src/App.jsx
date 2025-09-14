import React from 'react'
import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import Whyus from "./components/Whyus"
import HowItWorks from "./components/HowItWorks"
const App = () => {
  return (
    <div className="bg-gradient-to-b from-orange-500 via-bg-[#FFAE66] to-orange-300">
      <Navbar />
      <HeroSection />
      <Whyus />
      <HowItWorks />
    </div>
  );
}

export default App
