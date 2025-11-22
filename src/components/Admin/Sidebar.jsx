import { NavLink } from 'react-router-dom';
import { HiHome, HiUserGroup, HiUsers, HiCalendar, HiCog, HiArchive, HiExclamation,HiChartBar,  HiClipboardList } from 'react-icons/hi';

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const navItems = [
    { name: 'Dashboard', icon: HiHome, path: '/admin' },
    { name: 'Doctors', icon: HiUserGroup, path: '/admin/doctors' },
    { name: 'Patients', icon: HiUsers, path: '/admin/patients' },
    { name: 'Appointments', icon: HiCalendar, path: '/admin/appointments' },
    { 
      name: 'Pharmacy', 
      icon: HiArchive, 
      path: '/admin/pharmacy',
      alert: true // This could indicate low stock items
    },
    { name: 'Records', icon: HiChartBar, path: '/admin/records' }, 
    { name: 'Settings', icon: HiCog, path: '/admin/settings' },
  ];

  return (
    <div
      className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${isMobile ? 'fixed z-30' : 'relative'}
        bg-[#2563eb] text-white h-screen flex-shrink-0
        transition-all duration-300 ease-in-out
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-blue-400 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Hospital Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors duration-200 relative ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'hover:bg-white hover:text-blue-900'
                    } ${!sidebarOpen ? 'justify-center' : ''}`
                  }
                >
                  <item.icon className="text-xl" />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  {item.alert && (
                    <span className="absolute right-3 top-3 w-2 h-2  rounded-full"></span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-400">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="font-bold">A</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="font-medium">Admin</p>
                <p className="text-xs text-white">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;