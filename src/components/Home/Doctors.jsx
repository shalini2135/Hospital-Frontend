import React, { useEffect, useRef } from "react";

const doctors = [
  {
    name: "Dr. Priyanka David",
    specialty: "General Medicine",
    designation: "Chief Medical Officer",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqTO4ACAznDfghxUJVQ1kYYvEfoHefvSTfyA&s",
    timing: "9:00 AM - 1:00 PM",
    hours: "4 hours",
  },
  {
    name: "Dr. Michael Kishore",
    specialty: "Primary Care",
    designation: "Duty Medical Officer",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxYvyQ2iUP3yXc_NwS_BJ0OFtF4ff2cRk9cg&s",
    timing: "10:00 AM - 4:00 PM",
    hours: "6 hours",
  },
  {
    name: "Dr. Anu Sherina",
    specialty: "Gynecology",
    designation: "Senior Consultant",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT-7R6jHW55Y8g0YGkU_EU-ouEHahX9SyhJtuosCzCrGHU8e38VGF7UEyoKuDpzOT_vQE&usqp=CAU",
    timing: "11:00 AM - 3:00 PM",
    hours: "4 hours",
  },
  {
    name: "Dr. James Dharshan",
    specialty: "First Aid & Emergency",
    designation: "Emergency Medicine Consultant",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREL6ufFK4TA_K2m7Hjr5rcNTHnqjawSkQh2g&",
    timing: "Available 24/7",
    hours: "Emergency Duty",
  },
];

const Doctors = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current.querySelectorAll(".doctor-card");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => observer.observe(card));
  }, []);

  return (
    <div className="bg-white py-20 px-6 md:px-20" ref={sectionRef}>
      <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        General Doctors
      </h2>
      <p className="text-center text-lg text-gray-600 mb-14">
        Meet our experienced team dedicated to providing exceptional care.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="doctor-card opacity-0 transform scale-95 bg-gray-50 rounded-2xl p-6 shadow-md flex items-start gap-6 hover:shadow-xl transition duration-500"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {doctor.name}
              </h3>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
              <p className="text-sm text-gray-600">{doctor.designation}</p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Available:</strong> {doctor.timing}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Duration:</strong> {doctor.hours}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl transition duration-300"
      >
        ↑
      </button>
    </div>
  );
};

export default Doctors;