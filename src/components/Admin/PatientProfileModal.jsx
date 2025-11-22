// src/components/Admin/PatientProfileModal.js
import { 
  HiPhone, 
  HiMail,
  HiHome,
  HiClipboardList,
  HiShieldExclamation,
  HiCalendar,
  HiHeart,
  HiIdentification,
  HiLocationMarker
} from 'react-icons/hi';

const PatientProfileModal = ({ isOpen, onClose, patient }) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {patient.name || 'Unnamed Patient'}
              </h2>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                  patient.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {patient.gender || 'Unknown'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                  Age: {patient.age || 'Unknown'}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start">
                <HiMail className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-600">{patient.email || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <HiIdentification className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Patient ID</p>
                  <p className="text-gray-600">{patient.id || 'Not assigned'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <HiHome className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">
                    {[patient.address, patient.city, patient.state, patient.zipCode]
                      .filter(Boolean)
                      .join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <HiClipboardList className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Medical History</p>
                  <p className="text-gray-600">{patient.medicalHistory || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <HiShieldExclamation className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Allergies</p>
                  <p className="text-gray-600">{patient.allergies || 'Not specified'}</p>
                </div>
              </div>

              {patient.emergencyContacts?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <HiHeart className="mr-3 text-gray-500" />
                    <p className="font-medium text-gray-700">Emergency Contacts</p>
                  </div>
                  {patient.emergencyContacts.map((contact, index) => (
                    <div key={index} className="ml-8 bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{contact.name || 'No name'}</p>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p>{contact.phone || 'No phone'}</p>
                        {contact.email && <p>{contact.email}</p>}
                        {contact.relation && <p className="text-xs">Relation: {contact.relation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start">
                <HiCalendar className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Last Visit</p>
                  <p className="text-gray-600">{patient.lastVisit || 'No visit recorded'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <HiLocationMarker className="mt-1 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-700">Location</p>
                  <p className="text-gray-600">
                    {patient.city || 'City not specified'}, {patient.state || 'State not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;