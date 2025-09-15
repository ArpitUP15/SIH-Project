import React from "react";
import { useRef } from "react";
import Login from "./components/Login"
import SignupComponent from "./components/Signup"
import {Routes, Route} from "react-router-dom"
import HeroSectionLayout from "./components/HeroSectionLayout"

const App = () => {

 const homeRef = useRef(null);
 const featureRef = useRef(null);
 const testimonialRef = useRef(null);
 const howItWorksRef = useRef(null);
 const contactRef = useRef(null);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HeroSectionLayout
            homeRef={homeRef}
            featureRef={featureRef}
            testimonialRef={testimonialRef}
            howItWorksRef={howItWorksRef}
            contactRef={contactRef}
          />
        }
      ></Route>
      <Route path="/authenticate/login" element={<Login></Login>}></Route>
      <Route
        path="/authenticate/signup"
        element={<SignupComponent></SignupComponent>}
      ></Route>
    </Routes>
  );
};

export default App;
