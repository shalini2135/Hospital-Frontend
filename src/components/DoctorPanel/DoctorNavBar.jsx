// DoctorNavbar.jsx - Fixed dropdown positioning and outside click
import React, { useState, useEffect, useRef } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const DoctorNavbar = ({ doctor }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleIconClick = () => {
    setShowDropdown((prev) => !prev); // Toggle dropdown
  };

  const handleSignout = () => {
    // Optional: Clear any auth data
    // localStorage.removeItem("token");
    setShowDropdown(false); // Close dropdown
    navigate("/"); // Go to home page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="sticky top-0 z-50 w-full h-15 bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-extrabold tracking-tight font-serif">
          MediTrack
        </h1>

        {/* Profile Section with Doctor Name & Dropdown */}
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {/* Doctor Name */}
          {doctor && (
            <span className="text-sm font-extrabold tracking-tight font-serif">
              {doctor.doctorName}
            </span>
          )}
          
          <MdAccountCircle
            className="text-3xl cursor-pointer"
            onClick={handleIconClick}
          />

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-28 bg-white text-black shadow-lg rounded-md overflow-hidden">
              <button
                onClick={handleSignout}
                className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
              >
                Signout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;