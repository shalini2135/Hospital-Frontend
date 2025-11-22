import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ Import motion

const FertilityAndReproductiveMedicine = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="bg-[#f1f6ff] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-[#2c64dd] text-white py-6 px-8 shadow flex items-center gap-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#244fc7] transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Fertility & Reproductive Medicine</h1>
          <p className="text-sm">Compassionate fertility care with advanced reproductive technologies.</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-6xl mx-auto px-6 py-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Intro Section */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Approach to Fertility</h2>
          <p className="text-gray-700 mb-4">
            We understand the emotional and physical challenges of infertility. Our team offers a full range of
            reproductive services with personalized care plans tailored to each couple’s journey.
          </p>
          <p className="text-gray-700">
            From basic fertility evaluations to complex IVF cycles, we support you every step of the way using
            state-of-the-art technologies, holistic wellness strategies, and emotional guidance.
          </p>
        </motion.div>

        {/* Services Section */}
        <h2 className="text-xl font-bold mt-10 mb-6 text-center text-gray-800">Fertility Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Fertility Assessment",
              desc: "Includes hormone testing, ultrasound, and semen analysis to determine fertility status."
            },
            {
              title: "IVF & ICSI",
              desc: "In-vitro fertilization and intracytoplasmic sperm injection performed in advanced labs."
            },
            {
              title: "IUI (Intrauterine Insemination)",
              desc: "A simple, cost-effective method to enhance conception rates in selected cases."
            },
            {
              title: "Egg & Sperm Freezing",
              desc: "Preserve fertility for cancer patients, career planning, or medical reasons."
            },
            {
              title: "Counseling & Emotional Support",
              desc: "Emotional well-being services including support groups, stress management, and therapy."
            },
            {
              title: "Donor & Surrogacy Programs",
              desc: "Ethical and transparent access to donor eggs/sperm and surrogacy with legal guidance."
            }
          ].map(({ title, desc }, index) => (
            <motion.div
              key={index}
              className="bg-blue-100 p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-[#2c64dd] mb-2">{title}</h3>
              <p className="text-sm text-gray-700">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-10 text-center">Last updated: July 26, 2025</p>
      </motion.div>
    </motion.div>
  );
};

export default FertilityAndReproductiveMedicine;






