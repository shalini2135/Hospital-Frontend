import React, { useEffect, useState } from 'react';
import { Users, Building, FlaskRound as Flask, Award } from 'lucide-react';
import { motion } from 'framer-motion';

// Count-up hook
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = 60;
    const increment = end / steps;
    const intervalTime = duration / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.ceil(start));
      }
    }, intervalTime);

    return () => clearInterval(counter);
  }, [end, duration]);

  return count;
};

const Stats = () => {
  const doctors = useCountUp(85);
  const departments = useCountUp(18);
  const labs = useCountUp(12);
  const awards = useCountUp(150);

  const stats = [
    {
      icon: Users,
      number: doctors,
      label: 'Doctors'
    },
    {
      icon: Building,
      number: departments,
      label: 'Departments'
    },
    {
      icon: Flask,
      number: labs,
      label: 'Research Labs'
    },
    {
      icon: Award,
      number: awards,
      label: 'Awards'
    }
  ];

  const cardContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, 15, -15, 0],
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section id="stats" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="flex justify-center mb-4"
              >
                <stat.icon className="h-12 w-12 text-blue-600" />
              </motion.div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
