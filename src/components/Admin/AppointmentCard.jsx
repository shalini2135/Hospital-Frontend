import { HiClock, HiUser, HiCalendar } from 'react-icons/hi';

const AppointmentCard = ({ patient, doctor, time, date, status, onViewDetails }) => {
  const statusColors = {
    Confirmed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800'
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{patient}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{doctor}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
          {status}
        </span>
      </div>
      
      <div className="mt-3 sm:mt-4 flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center">
          <HiCalendar className="mr-1 text-[#2563eb]" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <HiClock className="mr-1 text-[#2563eb]" />
          <span>{time}</span>
        </div>
      </div>
      
      <div className="mt-3 sm:mt-4 flex justify-end space-x-2">
        <button 
          onClick={onViewDetails}
          className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-[#2563eb] text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;