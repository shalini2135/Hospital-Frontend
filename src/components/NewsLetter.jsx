import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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

const NewsLetter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const newsletterSections = [
    {
      title: "Stay Informed with Our Hospital Newsletter",
      content:
        "📰 Our newsletter brings you monthly updates on hospital events, health tips, wellness campaigns, and key service improvements.",
    },
    {
      title: "What You'll Find Inside",
      content:
        "✅ Health and wellness articles\n" +
        "✅ Doctor interviews & patient stories\n" +
        "✅ New equipment or departments\n" +
        "✅ Tips for preventive care and diet\n" +
        "✅ Staff recognitions and awards",
    },
    {
      title: "How to Subscribe",
      content:
        "📩 Visit the front desk to fill out a subscription form\n" +
        "🌐 Sign up online at ourhospital.com/newsletter\n" +
        "📱 Opt-in during patient registration",
    },
    {
      title: "Who Should Subscribe?",
      content:
        "👨‍👩‍👧‍👦 Patients and family members\n" +
        "👩‍⚕️ Staff and caregivers\n" +
        "📢 Community health workers\n" +
        "🏥 Hospital visitors",
    },
    {
      title: "Stay Connected",
      content:
        "📧 Email updates straight to your inbox\n" +
        "📎 PDF archive available on our website\n" +
        "🔗 Follow us on social media for highlights",
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
        <h1 className="text-2xl font-bold ml-6">Newsletter</h1>
      </div>

      {/* Content */}
      <motion.div
        className="px-6 py-8 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {newsletterSections.map((section, index) => (
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

export default NewsLetter;