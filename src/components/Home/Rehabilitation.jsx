import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i = 1) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const Rehabilitation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen text-blue-900 font-sans text-lg">
      {/* ✅ Sticky Animated Header */}
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-40">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center p-3 rounded-lg border border-transparent hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Rehabilitation</h1>
              <p className="text-blue-100 text-sm mt-1">Supportive care for recovery and strength</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.section
        className="py-10 px-6 md:flex items-center gap-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div
          className="md:w-1/2 min-h-[50vh] bg-cover bg-center rounded-xl shadow-lg"
          style={{
            backgroundImage: `url('https://img.freepik.com/free-photo/doctor-helping-patient_1098-20146.jpg?w=996&t=st=1696600426~exp=1696601026~hmac=5f151fd469f15406d4c36254eb5b260f6b6cc0e7c6eb9bdb1dcf0edc5317b11f')`,
          }}
        ></motion.div>

        <motion.div className="md:w-1/2 mt-6 md:mt-0 max-w-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Restore Function. Reclaim Independence.
          </h3>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Our rehabilitation programs are designed to support your recovery from injury, surgery, or illness with compassionate care and modern techniques.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            {[
              "Physical Therapy for mobility improvement",
              "Occupational Therapy for daily life activities",
              "Speech & Language Therapy",
              "Post-surgical rehab programs",
              "Cardiac and pulmonary rehabilitation",
            ].map((item, index) => (
              <motion.li
                key={index}
                custom={index}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-10 px-6 bg-white text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-8">
          Our Rehabilitation Services Include
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Multidisciplinary Team",
              desc: "Our team includes physical therapists, nurses, and doctors to provide well-rounded support.",
            },
            {
              title: "Customized Plans",
              desc: "Every recovery plan is uniquely designed based on the patient's condition and goals.",
            },
            {
              title: "Home-Based Rehab Options",
              desc: "We offer remote rehab sessions and guidance for home-based recovery.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:bg-blue-100 transition"
              custom={i}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-700">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tips Section */}
      <motion.section
        className="py-10 bg-blue-50 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-8 text-blue-900">Recovery Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {[
            { icon: "🧘‍♂️", text: "Practice light exercises consistently to regain strength." },
            { icon: "🛌", text: "Allow your body proper rest between rehab sessions." },
            { icon: "🍎", text: "Maintain a balanced diet to support muscle and tissue repair." },
            { icon: "🤝", text: "Work closely with your therapists and communicate openly." },
          ].map((tip, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-left hover:bg-blue-100 transition"
              custom={i}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
            >
              <div className="text-5xl mb-4">{tip.icon}</div>
              <p className="text-gray-800">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Rehabilitation;
