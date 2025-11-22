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

const GeneticTesting = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
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
              <h1 className="text-xl font-semibold">Genetic Testing</h1>
              <p className="text-blue-100 text-sm mt-1">Precision care through DNA insights</p>
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
            backgroundImage: `url('https://media.istockphoto.com/id/499085898/photo/scientist-in-laboratory.jpg?s=612x612&w=0&k=20&c=4gQ9xXPzH0GetW27GTkcRGmSbYnM5HzUciYxoCHmfUw=')`,
          }}
        ></motion.div>

        <motion.div className="md:w-1/2 mt-6 md:mt-0 max-w-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Unlock Genetic Insights for Personalized Care
          </h3>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Our Genetic Testing Services provide you with critical insights into your DNA, helping predict disease risk and guide treatment decisions.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            {[
              "Carrier screening for inherited conditions",
              "Genomic profiling for cancer therapy",
              "Pharmacogenomic testing for drug compatibility",
              "Prenatal and newborn screening",
              "Ancestry and lifestyle DNA testing",
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
          Why Choose Our Genetic Testing?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Advanced Laboratory",
              desc: "Our facility uses next-gen sequencing technology ensuring high accuracy and speed.",
            },
            {
              title: "Personalized Reports",
              desc: "Clear, actionable insights tailored to your health history and genetics.",
            },
            {
              title: "Confidential & Secure",
              desc: "Your data is encrypted and handled with strict privacy protocols.",
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
        <h2 className="text-2xl font-bold mb-8 text-blue-900">Genetic Wellness Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {[
            { icon: "🧬", text: "Discuss your family history with your provider for tailored testing options." },
            { icon: "💊", text: "Use genetic insights to avoid medications that may not work for your body." },
            { icon: "🥦", text: "Match your diet and exercise to your metabolic profile for optimal health." },
            { icon: "🧘‍♀️", text: "Manage stress, as gene expression can be influenced by lifestyle." },
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

export default GeneticTesting;
