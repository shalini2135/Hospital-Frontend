import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom * 0.2 },
  }),
};

const PatientCare = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="font-sans text-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center p-3 rounded-lg border border-transparent hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Patient Care</h1>
              <p className="text-blue-100 text-sm mt-1">
                24/7 patient care services available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <motion.section
        className="bg-blue-50 py-10 px-6 md:flex items-center gap-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={1}
      >
        <div
          className="md:w-1/2 min-h-[50vh] bg-cover bg-center rounded-xl shadow-lg"
          style={{
            backgroundImage:
              "url('https://www.generalmedicine.com/wp-content/uploads/2015/02/Dollarphotoclub_52420796.jpg')",
          }}
        ></div>

        <div className="md:w-1/2 mt-6 md:mt-0 max-w-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Compassionate Care at Every Step
          </h3>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Our hospital is dedicated to providing personalized care that respects the needs of every patient...
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>24/7 nursing support & bedside care</li>
            <li>In-room call systems and quick response teams</li>
            <li>Nutritious meals with dietary planning</li>
            <li>Medical interpretation & patient advocacy services</li>
            <li>Support for elderly and differently-abled patients</li>
          </ul>
        </div>
      </motion.section>

      {/* Services */}
      <motion.section
        className="py-10 px-6 bg-white text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={2}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-8">
          How We Support Your Wellness
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {["Personalized Treatment Plans", "Integrated Care Teams", "Mental & Emotional Support"].map((title, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl shadow-md transition duration-300"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={3 + i}
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">{title}</h4>
              <p className="text-gray-700">
                {title === "Personalized Treatment Plans"
                  ? "Care tailored to your diagnosis, lifestyle, and recovery goals."
                  : title === "Integrated Care Teams"
                  ? "Collaboration between doctors, nurses, therapists, and case managers."
                  : "Trained counselors and wellness programs for emotional healing."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Philosophy */}
      <motion.section
        className="py-12 px-6 bg-blue-50 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={6}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Our Patient-Centered Philosophy
        </h2>
        <p className="max-w-3xl mx-auto text-gray-800 leading-relaxed">
          Every decision we make is based on what’s best for our patients...
        </p>
      </motion.section>

      {/* Tech & Safety */}
      <motion.section
        className="py-12 px-6 bg-white text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={7}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Advanced Technology & Safety First
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
          {["Smart Monitoring Systems", "Infection Control Protocols"].map((title, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:bg-blue-100 transition duration-300"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={8 + i}
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">{title}</h4>
              <p className="text-gray-700">
                {title === "Smart Monitoring Systems"
                  ? "Real-time tracking of patient vitals and automated alerts..."
                  : "Rigorous sterilization, PPE usage, and air purification..."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-12 bg-blue-50 px-6 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={10}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-10">
          What Our Patients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["The nurses were incredibly kind and attentive. I felt safe and cared for every single day.", "Excellent service. From the food to the medical care, everything was well-organized and thoughtful.", "I recovered faster than I expected thanks to their customized therapy and constant encouragement."].map((quote, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md hover:bg-blue-100 transition duration-300 text-left"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={11 + i}
            >
              <p className="text-gray-800 italic mb-4">“{quote}”</p>
              <span className="font-semibold text-blue-800">
                {i === 0 ? "— Ananya R." : i === 1 ? "— Suresh M." : "— Priya K."}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default PatientCare;