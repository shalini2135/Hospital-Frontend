import { HiUserCircle, HiCalendar, HiHeart, HiPhone } from 'react-icons/hi';

const PatientCard = ({ name, age, gender, bloodType, lastVisit }) => {
  const genderColors = {
    Male: 'text-blue-600 bg-blue-100',
    Female: 'text-pink-600 bg-pink-100',
    Other: 'text-purple-600 bg-purple-100'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <HiUserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate">
              <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{age} years</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${genderColors[gender] || 'bg-gray-100 text-gray-800'}`}>
              {gender}
            </span>
          </div>
          
          <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center text-gray-600">
              <HiHeart className="mr-1 sm:mr-2 text-[#2563eb]" />
              <span>{bloodType}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <HiCalendar className="mr-1 sm:mr-2 text-[#2563eb]" />
              <span className="truncate">Last: {lastVisit}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex justify-between">
        <button className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-[#2563eb] text-white rounded hover:bg-blue-700 transition-colors">
          Medical History
        </button>
        <button className="p-1 sm:p-2 text-gray-500 hover:text-[#2563eb] rounded-full hover:bg-blue-50">
          <HiPhone className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default PatientCard;