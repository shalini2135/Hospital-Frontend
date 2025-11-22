import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from '@/Pages/Admin/Dashboard';
import Doctors from '@/Pages/Admin/Doctors';
import Patients from '@/Pages/Admin/Patients';
import Appointments from '@/Pages/Admin/Appointments';
import Settings from '@/Pages/Admin/Settings';
import PharmacyInventory from '@/Pages/Admin/Pharmacy/PharmacyInventory';
import AddMedicineForm from '@/Pages/Admin/Pharmacy/AddMedicineForm';
import EditMedicineForm from '@/Pages/Admin/Pharmacy/EditMedicineForm';
import RecordsDashboard from "@/Pages/Admin/RecordsDashboard";

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="records" element={<RecordsDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="pharmacy" element={<PharmacyInventory />} />
            <Route path="pharmacy/add" element={<AddMedicineForm />} />
            <Route path="pharmacy/edit/:id" element={<EditMedicineForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Admin;