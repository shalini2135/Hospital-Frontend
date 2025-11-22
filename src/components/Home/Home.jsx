import React, { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Departments from "./Departments";
import Doctors from "./Doctors";
// import Appointment from "./Appointment";
import Stats from "./Stats";
import Gallery from "./Gallery";
import FAQ from "./FAQ";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Footer from "./Footer";
import Login from "../../Pages/Auth/Login";
import Signup from "../../Pages/Auth/Signup";



const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {

    setIsSignupOpen(false);

    setIsLoginOpen(true);
  };

  const openSignup = () => {

    setIsLoginOpen(false);

    setIsSignupOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };
  
  return (
    <>

      <Header onLoginClick={openLogin} onSignupClick={openSignup} />


      <div className="pt-16">
        <section id="hero">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="departments">
          <Departments />
        </section>
        <section id="doctors">
          <Doctors />
        </section>
        
        <Stats />
        <Gallery />
        <FAQ />
        <Testimonials />
        <section id="contact">
          <Contact />
        </section>
        <Footer />
      </div>
      {(isLoginOpen || isSignupOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {isLoginOpen && (
            <Login onClose={closeModals} onSignupClick={openSignup} />
          )}
          {isSignupOpen && (
            <Signup onClose={closeModals} onLoginClick={openLogin} />
          )}

        </div>
      )}
    </>
  );
};

export default Home;
