import { HiMail, HiPhone, HiStatusOnline, HiUserCircle, HiAcademicCap, HiBriefcase, HiGlobe } from 'react-icons/hi';
import LoadingSpinner from './LoadingSpinner';

const DoctorProfileModal = ({ isOpen, onClose, doctor, isLoading }) => {
  if (!isOpen || !doctor) return null;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/default-doctor.png';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Doctor Profile</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center">
                {doctor.photoUrl ? (
                  <img 
                    src={doctor.photoUrl} 
                    alt={doctor.doctorName}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                    onError={handleImageError}
                  />
                ) : (
                  <HiUserCircle className="w-32 h-32 text-gray-400 mb-4" />
                )}
                <h3 className="text-xl font-bold text-center">{doctor.doctorName}</h3>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                <div className={`mt-2 px-3 py-1 rounded-full text-xs ${
                  doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doctor.status}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <HiStatusOnline className="mr-2 text-blue-500" />
                    Professional Information
                  </h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Doctor ID:</span> {doctor.doctorId}</p>
                    <p><span className="font-medium">NMR ID:</span> {doctor.nmrId || 'Not specified'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <HiAcademicCap className="mr-2 text-blue-500" />
                    Education
                  </h4>
                  <p>{doctor.education || 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <HiBriefcase className="mr-2 text-blue-500" />
                    Experience
                  </h4>
                  <p>{doctor.experience || 'Not specified'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <HiMail className="mr-2 text-blue-500" />
                      Contact
                    </h4>
                    <div className="space-y-2">
                      <p>{doctor.email}</p>
                      <p>{doctor.phone || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <HiGlobe className="mr-2 text-blue-500" />
                      Languages
                    </h4>
                    <p>{doctor.languages || 'Not specified'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-3">Bio</h4>
                  <p>{doctor.bio || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;