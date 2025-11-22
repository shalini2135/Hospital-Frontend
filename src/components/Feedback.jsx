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

const Feedback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const feedbackSections = [
    {
      title: "Your Voice Matters",
      content:
        "At our hospital, we deeply value your thoughts. Whether it's appreciation, suggestions, or concerns — every feedback helps us improve and serve better.",
    },
    {
      title: "How We Use Your Feedback",
      content:
        "✅ Improve patient care and services\n" +
        "✅ Upgrade facilities based on suggestions\n" +
        "✅ Address any gaps in communication or experience\n" +
        "✅ Recognize outstanding staff and departments",
    },
    {
      title: "Ways to Submit Feedback",
      content:
        "📞 Call our feedback helpline at 1800-000-0000\n" +
        "📧 Email us at feedback@ourhospital.com\n" +
        "📝 Drop your feedback at our reception\n" +
        "🌐 Use the Feedback section on our website/app",
    },
    {
      title: "We Are Listening",
      content:
        "Your feedback is reviewed regularly by our Quality & Experience Team. We ensure responses and actions are taken within 48 hours for genuine concerns.",
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
        <h1 className="text-2xl font-bold ml-6">Feedback & Suggestions</h1>
      </div>

      {/* Animated Sections */}
      <motion.div
        className="px-6 py-8 space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {feedbackSections.map((section, index) => (
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

export default Feedback;