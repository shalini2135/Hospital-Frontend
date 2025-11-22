import { HiBell, HiSearch, HiChevronDown, HiLogout } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Sample notifications data
  const notifications = [
    { id: 1, text: 'New patient registration', time: '10 mins ago' },
    { id: 2, text: 'Appointment reminder', time: '1 hour ago' },
    { id: 3, text: 'System update available', time: '2 days ago' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Implement logout logic here
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-2 md:mr-4 text-gray-600 hover:text-[#2563eb]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

       <h1 className="font-bold text-blue-600 text-lg sm:text-xl md:text-2xl lg:text-3xl">MediTrack</h1>
       
      </div>
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notifications dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 text-gray-600 hover:text-[#2563eb]"
          >
            <HiBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
                <button className="text-xs text-[#2563eb] hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center space-x-1 focus:outline-none"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold">
              A
            </div>
            <HiChevronDown className={`text-gray-600 transition-transform ${profileOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-800">Admin Name</p>
                <p className="text-xs text-gray-500">Hospital Admin</p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <HiLogout className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;