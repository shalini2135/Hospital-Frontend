import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null); // Removed TypeScript type

  const images = [
    {
      src: 'https://img.freepik.com/premium-photo/modern-operating-room-with-advanced-medical-equipment_641503-12952.jpg',
      alt: 'Modern hospital facility'
    },
    {
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1gKNoneRzTZWISj7PQhTth-Wrl6Ndp8Q05A&s',
      alt: 'Medical equipment'
    },
    {
      src: 'https://media.istockphoto.com/id/1171902434/photo/smart-industry-control-concept.jpg?s=612x612&w=0&k=20&c=c1Hrxeu7UzcoS-cPPtlYn6b7luFwcPMvSLuZeEICLXo=',
      alt: 'Doctor consultation'
    },
    {
      src: 'https://t3.ftcdn.net/jpg/08/81/62/02/360_F_881620223_CwVewD9btKnyyvbT3UG2tPNFyICAjglP.jpg',
      alt: 'Surgery room'
    },
    {
      src: 'https://hospitalarchitects.in/sites/default/files/best_architect_for_hospital_design_in_india.jpg',
      alt: 'Patient care'
    },
    {
      src: 'https://www.cgarchitect.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcU1zIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--09b55469a8dea7a5cfb9cd831f70fde35cb37af4/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWxZRk1Eb0tjMkYyWlhKN0Jqb01jWFZoYkdsMGVXbGsiLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--a140f81341e053a34b77dbf5e04e777cacb11aff/55cb72de.jpg',
      alt: 'Medical team'
    },
    {
      src: 'https://thumbs.dreamstime.com/b/advanced-hospital-room-blue-lighting-featuring-patient-bed-high-tech-medical-equipment-creating-futuristic-healthcare-386850957.jpg',
      alt: 'Laboratory'
    },
    {
      src: 'https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/5c38e5d4-741e-444b-81b0-9a5d6103e16e/fe5ce67b-b9fd-4442-969d-93fe764b2cc7.png',
      alt: 'Hospital reception'
    }
  ];

  const openLightbox = (index) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a look at our modern facilities and advanced medical equipment
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="h-8 w-8" />
              </button>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
