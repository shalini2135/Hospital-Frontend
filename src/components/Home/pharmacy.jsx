import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Pharmacy = () => {
  const navigate = useNavigate();

  // ✅ Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen text-blue-900">

      {/* ✅ Sticky Header */}
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
              <h1 className="text-xl font-semibold">Pharmacy Service</h1>
              <p className="text-blue-100 text-sm mt-1">
                24/7 pharmacy services available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Image and Overview Section */}
      <motion.section
        className="md:flex items-center px-6 gap-10 mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="md:w-1/2 h-[50vh] bg-cover bg-center rounded-xl shadow-lg"
          style={{
            backgroundImage:
              "url('https://graduate.northeastern.edu/resources/wp-content/uploads/sites/4/2022/01/what-does-a-pharmacist-do.jpg')",
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        ></motion.div>

        <motion.div
          className="md:w-1/2 mt-6 md:mt-0"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4">Complete Care in One Place</h2>
          <p className="text-blue-800 mb-4">
            Our pharmacy is integrated into the hospital to ensure timely, safe, and efficient access to prescribed medications. Our qualified pharmacists guide patients through usage, side effects, and potential interactions.
          </p>
          <p className="text-blue-800">
            We prioritize quality assurance, transparency, and patient education with every prescription we fulfill.
          </p>
        </motion.div>
      </motion.section>

      {/* ✅ Highlights Section */}
      <motion.section
        className="py-12 px-6 mt-12 bg-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-8">Why Our Pharmacy?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {[
            {
              title: "24/7 Availability",
              desc: "Day or night, our pharmacy is always ready to support emergency and routine prescriptions.",
            },
            {
              title: "Digital Inventory Tracking",
              desc: "Real-time medication availability monitored to prevent stock-outs.",
            },
            {
              title: "Expert Pharmacists",
              desc: "Licensed professionals on hand for personalized medication guidance.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-blue-100 p-6 rounded-xl shadow-md hover:bg-blue-200 transition duration-300"
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">{item.title}</h4>
              <p className="text-blue-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ✅ Footer Note */}
      <motion.div
        className="text-center text-sm text-blue-600 mt-12 pb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p>We're committed to improving your care with safe medication practices.</p>
      </motion.div>
    </div>
  );
};

export default Pharmacy;