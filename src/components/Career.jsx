import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Career = () => {
  const navigate = useNavigate();

  // ✅ Scroll to top on component load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Why Join Us?",
      content:
        "At our hospital, you're not just an employee — you're family. We value your passion, celebrate your dedication, and support your ambitions. Whether you're on the frontlines or behind the scenes, your work matters and changes lives every day.",
    },
    {
      title: "What We Offer",
      content:
        "✅ Competitive Salaries\n" +
        "✅ Health Insurance & Wellness Programs\n" +
        "✅ Paid Time Off & Maternity/Paternity Leave\n" +
        "✅ Professional Development Programs\n" +
        "✅ Collaborative Work Culture\n" +
        "✅ State-of-the-Art Medical Technology\n" +
        "✅ Cafeteria & Recreational Zones\n" +
        "✅ Transport Facilities (select locations)",
    },
    {
      title: "Career Growth",
      content:
        "We invest in our people. Whether you’re just starting or looking to level up, we provide tailored growth paths, leadership training, and skill certifications. Grow with us — personally and professionally.",
    },
    {
      title: "Current Openings",
      content:
        "📌 Registered Nurses\n📌 Lab Technicians\n📌 Front Office Executives\n📌 Pharmacists\n📌 IT Support Specialists\n📌 HR & Admin Staff\n\nWe're always looking for passionate professionals ready to make a difference!",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-4 px-6 flex items-center rounded-b-2xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 hover:text-gray-300 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-lg"></span>
        </button>
        <h1 className="text-2xl font-bold ml-6">Career Opportunities</h1>
      </div>

      {/* Animated Sections */}
      <motion.div
        className="px-6 py-8 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {sections.map((section, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={fadeInUp}
            className={`rounded-2xl p-6 shadow-md whitespace-pre-line ${
              index % 2 === 0 ? "bg-white" : "bg-blue-50"
            }`}
          >
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              {section.content}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Career;