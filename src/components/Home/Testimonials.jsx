import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Patient',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The care I received at Medilab was exceptional. The medical staff was professional, compassionate, and always available to answer my questions. I felt truly cared for throughout my treatment.',
      rating: 5
    },
    {
      name: 'Michael Johnson',
      role: 'Patient',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Outstanding medical facility with state-of-the-art equipment. The doctors are highly skilled and take the time to explain everything clearly. I highly recommend Medilab for anyone seeking quality healthcare.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Patient',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'From the moment I walked in, I was impressed by the cleanliness and organization. The staff was friendly and efficient, and my doctor was thorough and caring. Excellent experience overall.',
      rating: 5
    },
    {
      name: 'David Wilson',
      role: 'Patient',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The emergency department saved my life. The quick response, professional care, and follow-up treatment were all top-notch. I am grateful for the skilled medical team at Medilab.',
      rating: 5
    },
    {
      name: 'Lisa Anderson',
      role: 'Patient',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The pediatric department is wonderful. My children feel comfortable here, and the staff knows how to work with kids. The doctors are patient and explain everything in terms we can understand.',
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">What Our Patients Say</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Don't just take our word for it. Here's what our patients have to say about 
              their experience with our medical services and healthcare professionals.
            </p>
          </div>

          {/* Testimonial Slider */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              
              <div className="mb-6">
                <div className="flex mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  "{testimonials[currentSlide].content}"
                </p>
              </div>

              <div className="flex items-center">
                <img
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {testimonials[currentSlide].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[currentSlide].role}
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={prevSlide}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;