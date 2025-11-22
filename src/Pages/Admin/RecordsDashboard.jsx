import { useState, useEffect } from 'react';
import { HiCalendar, HiCurrencyDollar, HiUserGroup, HiChartBar, HiChevronDown, HiDownload, HiClipboardCopy } from 'react-icons/hi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RecordsDashboard = () => {
  // Date filter state
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper function to create date without time component
  const createDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  };

  // Sample appointment data with proper Date objects
  const allAppointments = [
    { id: 1, patient: "John Doe", date: createDate('2025-07-15'), time: "10:00 AM", service: "Checkup", amount: 120, status: "Completed" },
    { id: 2, patient: "Jane Smith", date: createDate('2025-07-14'), time: "02:30 PM", service: "Dental Cleaning", amount: 95, status: "Completed" },
    { id: 3, patient: "Robert Johnson", date: createDate('2025-07-14'), time: "09:15 AM", service: "X-Ray", amount: 150, status: "No-show" },
    { id: 4, patient: "Sarah Williams", date: createDate('2025-08-4'), time: "11:45 AM", service: "Consultation", amount: 80, status: "Completed" },
    { id: 5, patient: "Michael Brown", date: createDate('2025-07-31'), time: "03:00 PM", service: "Surgery", amount: 450, status: "Completed" },
    { id: 6, patient: "Emily Davis", date: createDate('2025-08-2'), time: "01:30 PM", service: "Follow-up", amount: 60, status: "Cancelled" },
  ];

  // State for displayed appointments and metrics
  const [displayedAppointments, setDisplayedAppointments] = useState(allAppointments);
  const [metrics, setMetrics] = useState(calculateMetrics(allAppointments));

  // Calculate metrics function
  function calculateMetrics(appointments) {
    return {
      revenue: appointments.reduce((sum, app) => sum + app.amount, 0),
      appointments: appointments.length,
      newPatients: appointments.filter(app => app.status === "Completed").length,
      cancellationRate: (appointments.filter(app => 
        app.status === "Cancelled" || app.status === "No-show"
      ).length / appointments.length) * 100 || 0
    };
  }

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'specificDate', label: 'Specific Date' }
  ];

  // Get current filter label
  const currentFilterLabel = filterOptions.find(opt => opt.value === dateFilter)?.label;

  // Helper function to compare dates without time component
  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Filter data by date - runs when filter changes
  useEffect(() => {
    filterData();
  }, [dateFilter, selectedDate]);

  // Filter data by date
  const filterData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filteredAppointments = [...allAppointments];
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time component
      
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);

      switch(dateFilter) {
        case 'today':
          filteredAppointments = allAppointments.filter(app => 
            isSameDate(app.date, today)
          );
          break;
        case 'lastWeek':
          filteredAppointments = allAppointments.filter(app => 
            app.date >= oneWeekAgo && app.date <= today
          );
          break;
        case 'lastMonth':
          filteredAppointments = allAppointments.filter(app => 
            app.date >= oneMonthAgo && app.date <= today
          );
          break;
        case 'specificDate':
          if (selectedDate) {
            const compareDate = new Date(selectedDate);
            compareDate.setHours(0, 0, 0, 0); // Reset time component
            filteredAppointments = allAppointments.filter(app => 
              isSameDate(app.date, compareDate)
            );
          }
          break;
        default: // 'all' case
          filteredAppointments = allAppointments;
      }

      setMetrics(calculateMetrics(filteredAppointments));
      setDisplayedAppointments(filteredAppointments);
      setIsLoading(false);
    }, 500);
  };

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setShowDropdown(false);
    if (filter !== 'specificDate') {
      setSelectedDate(null);
    }
  };

  // Export data as CSV
  const exportToCSV = () => {
    const formatDateForCSV = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const headers = ["Patient", "Date", "Time", "Service", "Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...displayedAppointments.map(app => [
        `"${app.patient}"`,
        formatDateForCSV(app.date),
        app.time,
        `"${app.service}"`,
        app.amount,
        app.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `appointments_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy data to clipboard (without alert)
  const copyToClipboard = () => {
    const formatDateForDisplay = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const text = displayedAppointments.map(app => 
      `${app.patient}\t${formatDateForDisplay(app.date)}\t${app.time}\t${app.service}\t$${app.amount}\t${app.status}`
    ).join("\n");
    
    navigator.clipboard.writeText(text).catch(err => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Records Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              <HiCalendar className="text-gray-400 mr-2" />
              {currentFilterLabel}
              <HiChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDateFilterChange(option.value)}
                      className={`block px-4 py-2 text-sm w-full text-left ${dateFilter === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {dateFilter === 'specificDate' && (
            <div className="flex items-center border rounded-lg px-3 py-2">
              <HiCalendar className="text-gray-400 mr-2" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select date"
                className="focus:outline-none"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          )}
          
          <button
            onClick={filterData}
            className={`px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || (dateFilter === 'specificDate' && !selectedDate)}
          >
            {isLoading ? 'Filtering...' : 'Apply Filter'}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${metrics.revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <HiCurrencyDollar className="w-6 h-6 text-[#2563eb]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {dateFilter === 'today' ? 'Today' : 
             dateFilter === 'lastWeek' ? 'Last 7 days' : 
             dateFilter === 'lastMonth' ? 'Last 30 days' : 
             dateFilter === 'specificDate' && selectedDate ? selectedDate.toLocaleDateString() : 'All time'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Appointments</p>
              <p className="text-2xl font-bold mt-1">{metrics.appointments.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <HiUserGroup className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Completed: {metrics.newPatients}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Patients</p>
              <p className="text-2xl font-bold mt-1">{metrics.newPatients}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <HiUserGroup className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {dateFilter === 'all' ? 'Total' : 'In period'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cancellation Rate</p>
              <p className="text-2xl font-bold mt-1">{metrics.cancellationRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <HiChartBar className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Industry avg: 5.1%</p>
        </div>
      </div>

      {/* Appointments Table with Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-medium">Appointment Records</h3>
            <p className="text-sm text-gray-500">
              Showing {displayedAppointments.length} appointments for {dateFilter === 'today' ? 'today' : 
                           dateFilter === 'lastWeek' ? 'the last week' : 
                           dateFilter === 'lastMonth' ? 'the last month' : 
                           dateFilter === 'specificDate' && selectedDate ? selectedDate.toLocaleDateString() : 'all time'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={copyToClipboard}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              disabled={displayedAppointments.length === 0}
            >
              <HiClipboardCopy className="mr-1" /> Copy
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
              disabled={displayedAppointments.length === 0}
            >
              <HiDownload className="mr-1" /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {displayedAppointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No appointments found for the selected filter
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedAppointments.map((appointment) => {
                  const displayDate = `${appointment.date.getDate().toString().padStart(2, '0')}/${(appointment.date.getMonth() + 1).toString().padStart(2, '0')}/${appointment.date.getFullYear()}`;
                  return (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{displayDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appointment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : appointment.status === "Cancelled" 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordsDashboard;