import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion'; // ✅ Import motion

const Pediatracks = () => {
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
          <h1 className="text-2xl font-bold">PediaTracks</h1>
          <p className="text-sm">Comprehensive child health and wellness services.</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Child-Centered Healthcare</h2>
          <p className="text-gray-700 mb-4">
            PediaTracks offers a safe, engaging, and supportive environment for your child’s health needs.
            From infancy to adolescence, we ensure every child receives expert care across all stages of development.
          </p>
          <p className="text-gray-700">
            Our pediatric team includes specialists in neonatology, pediatric surgery, developmental pediatrics,
            adolescent medicine, and child psychology. We’re committed to early diagnosis, preventive care,
            and personalized treatment plans for every child.
          </p>
        </motion.div>

        {/* Specialty Areas */}
        <h2 className="text-xl font-bold mt-10 mb-6 text-center text-gray-800">Specialty Areas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Well-Child Visits",
              desc: "Routine health checkups, immunizations, and developmental tracking for all age groups."
            },
            {
              title: "Pediatric Emergency",
              desc: "24/7 pediatric emergency services equipped for critical care situations."
            },
            {
              title: "Neonatal Intensive Care (NICU)",
              desc: "Advanced care for premature babies and critically ill newborns by neonatal experts."
            },
            {
              title: "Developmental Assessment",
              desc: "Tracking speech, motor skills, cognitive development, and behavioral milestones."
            },
            {
              title: "Adolescent Health",
              desc: "Puberty counseling, reproductive health, mental wellness, and sports fitness programs."
            },
            {
              title: "Pediatric Subspecialty Clinics",
              desc: "Dedicated clinics for asthma, epilepsy, juvenile diabetes, pediatric cardiology, and more."
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

        <p className="text-sm text-gray-500 mt-10 text-center">Last updated: July 26, 2025</p>
      </motion.div>
    </motion.div>
  );
};

export default Pediatracks;





