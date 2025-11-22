import React, { useState } from 'react';
import { TestTube, Stethoscope, Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const features = [
    {
      icon: <TestTube className="h-6 w-6 text-blue-600" />,
      title: "Advanced Laboratory Services",
      description: "State-of-the-art diagnostic facilities with cutting-edge technology"
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
      title: "Expert Medical Care",
      description: "Comprehensive healthcare solutions delivered by experienced professionals"
    },
    {
      icon: <Heart className="h-6 w-6 text-blue-600" />,
      title: "Compassionate Treatment",
      description: "Patient-centered approach with personalized care and attention"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Image / Video Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96">
              {!isVideoOpen ? (
                <>
                  <img
                    src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                    alt="Medical team"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={() => setIsVideoOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <video
                  src="https://media.istockphoto.com/id/959627204/video/professional-surgeons-and-assistants-talk-and-use-digital-tablet-computer-during-surgery-they.mp4?s=mp4-480x480-is&k=20&c=MIddk2ADsFeEO-U3wcBgtiFV00Onjd42QvOoO9Aws2U="
                  className="w-full h-full object-cover rounded-2xl"
                  autoPlay
                  controls
                />
              )}
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              At Medilab, we are dedicated to providing exceptional healthcare services 
              with a focus on innovation, compassion, and excellence. Our state-of-the-art 
              facilities and experienced medical professionals work together to ensure 
              the best possible outcomes for our patients.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h5>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
