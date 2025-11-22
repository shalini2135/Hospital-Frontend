import { HiUserCircle, HiPhone, HiMail, HiStatusOnline } from 'react-icons/hi';

const DoctorCard = ({ name, specialty, email, phone, availability, onViewProfile }) => {
  const availabilityColors = {
    Available: 'text-green-600 bg-green-100',
    'On Leave': 'text-yellow-600 bg-yellow-100',
    Busy: 'text-red-600 bg-red-100',
    'In Surgery': 'text-purple-600 bg-purple-100'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <HiUserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate">
              <h3 className="font-medium text-gray-900 truncate">{name}</h3>
              <p className="text-sm text-gray-600 truncate">{specialty}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${availabilityColors[availability] || 'bg-gray-100 text-gray-800'}`}>
              {availability}
            </span>
          </div>
          
          <div className="mt-3 space-y-1 sm:space-y-2 text-sm">
            <div className="flex items-center text-gray-600 truncate">
              <HiMail className="mr-2 text-[#2563eb] flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <HiPhone className="mr-2 text-[#2563eb] flex-shrink-0" />
              <span>{phone}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <button 
          onClick={onViewProfile}
          className="px-3 py-1 text-sm bg-[#2563eb] text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Profile
        </button>
        <div className="flex space-x-2">
          <button className="p-1 sm:p-2 text-gray-500 hover:text-[#2563eb] rounded-full hover:bg-blue-50">
            <HiStatusOnline className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-1 sm:p-2 text-gray-500 hover:text-[#2563eb] rounded-full hover:bg-blue-50">
            <HiPhone className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;