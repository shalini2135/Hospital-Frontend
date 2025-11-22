import React, { useState, useEffect, useRef } from "react";
import { LogIn, Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = ({ onLoginClick }) => {
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [departmentsTimeout, setDepartmentsTimeout] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("currentUser") !== null
  );
  const [activeTab, setActiveTab] = useState("#hero");
const getCurrentUser = () => {
  const userData = localStorage.getItem("currentUser");
  if (!userData) return null;
  let usertemp = localStorage.getItem("currentUser");
  try {
    // Try parsing as JSON first
    const parsed = JSON.parse(userData);
    console.log(parsed, "ugd");
    usertemp=parsed;
    return {
      userId: parsed.userId || "",
      username: parsed.username || "",
      name: parsed.name || parsed.username || "",
      role: parsed.role ? parsed.role : "null"
    };
  } catch (error) {
    // If it's not JSON, treat it as a plain string (ID)
    console.log("User data is not JSON, treating as plain string:", userData);
     return {
      userId: userData,  // Use the string directly as userId
      username: userData,  // Use the string directly as username
      name: userData,  // Use the string directly as name
      role: "patient"
    };
  }
};
  const currentUser = isLoggedIn ? getCurrentUser() : null;
  console.log(currentUser,"wel");
  const username = currentUser?.username || "Profile";
  const firstName = currentUser?.username?.split(" ")[0] || "Profile";

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();

const departments = [
  { name: "Cardiology", link: "/departments/cardiology" },
  { name: "Neurology", link: "/departments/neurology" },
  { name: "Hepatology", link: "/departments/hepatology" },
  { name: "Pediatrics", link: "/departments/pediatrics" },
  { name: "Eye Care", link: "/departments/eyecare" },
  { name: "Dental", link: "/departments/dental" },
  { name: "Fertility", link: "/departments/fertility" },
  { name: "Psychology", link: "/departments/psychology" },
  { name: "General", link: "/departments/general" }
];


  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("currentUser") !== null);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (departmentsTimeout) clearTimeout(departmentsTimeout);
    };
  }, [departmentsTimeout]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    if (!currentUser) return;

    switch (currentUser.role) {
      case "ROLE_ADMIN":
        navigate("/admin/");
        break;
      case "ROLE_DOCTOR":
        navigate(`/doctor/${currentUser.userId}`);
        break;
      case "ROLE_NURSE":
        navigate("/reception/");
        break;
      case "ROLE_PATIENT":
        navigate(`/patient/${currentUser.userId}`);
        break;
      default:
        navigate("/");
    }
    setProfileDropdownOpen(false);
  };

  const handleNavClick = (href) => {
    setActiveTab(href);
    setIsMobileMenuOpen(false);

    const scrollToSection = () => {
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = href; // fallback
      }
    };

    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToSection, 100);
    } else {
      scrollToSection();
    }
  };

  const navLinkClass = (href) =>
    `text-blue-100 hover:text-white hover:bg-blue-700 rounded-md px-2 py-1 transition duration-200 ${
      activeTab === href ? "bg-blue-700" : ""
    }`;

  const mobileNavLinkClass = (href) =>
    `block px-4 py-3 text-white hover:bg-blue-700 border-b border-blue-500 transition duration-200 ${
      activeTab === href ? "bg-blue-700 border-l-4 border-l-white" : ""
    }`;

  return (
    <div className="fixed top-0 left-0 w-full z-50 scroll-smooth">
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              MediTrack
            </h1>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={() => handleNavClick("#hero")}
                className={navLinkClass("#hero")}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("#about")}
                className={navLinkClass("#about")}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick("#services")}
                className={navLinkClass("#services")}
              >
                Services
              </button>

              <div
                className="relative"
                ref={profileRef}
                onMouseEnter={() => {
                  if (departmentsTimeout) clearTimeout(departmentsTimeout);
                  setIsDepartmentsOpen(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setIsDepartmentsOpen(false);
                  }, 200);
                  setDepartmentsTimeout(timeout);
                }}
              >
                <button
                  onClick={() => handleNavClick("#departments")}
                  className={`${navLinkClass(
                    "#departments"
                  )} flex items-center`}
                >
                  Departments
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

{isDepartmentsOpen && (
  <div className="absolute left-0 mt-2 w-96 bg-white border border-gray-200 shadow-lg rounded-md z-10 p-2 grid grid-cols-2 gap-1">
    {departments.map((dept, idx) => (
      <Link
        key={idx}
        to={dept.link}   // use "to" instead of "href"
        className="block px-4 py-2 text-sm text-black hover:bg-blue-50 hover:text-blue-600"
        onClick={() => setIsDepartmentsOpen(false)} // optional: close dropdown after click
      >
        {dept.name}
      </Link>
    ))}
  </div>
)}

              </div>

              <button
                onClick={() => handleNavClick("#doctors")}
                className={navLinkClass("#doctors")}
              >
                Doctors
              </button>
              <button
                onClick={() => handleNavClick("#contact")}
                className={navLinkClass("#contact")}
              >
                Contact
              </button>
              {/* <button
                onClick={() => handleNavClick("#appointment")}
                className={${navLinkClass("#appointment")} hidden lg:block}
              >
                Appointment
              </button> */}
            </div>

            {/* Login/Profile */}
            <div className="hidden md:flex items-center" ref={profileRef}>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-blue-100 flex items-center transition duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {username}
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        My Profile
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onLoginClick(handleLoginSuccess)}
                  className="px-3 py-2 lg:px-4 lg:py-2 bg-white text-blue-600 rounded-full hover:bg-blue-100 flex items-center transition duration-200 text-sm lg:text-base"
                >
                  <LogIn className="w-4 h-4 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="px-3 py-1 bg-white text-blue-600 rounded-full hover:bg-blue-100 flex items-center transition duration-200"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-xs">{firstName}</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
                      >
                        <User className="w-4 h-4 inline mr-2" />
                        My Profile
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onLoginClick(handleLoginSuccess)}
                  className="px-2 py-1 bg-white text-blue-600 rounded-full hover:bg-blue-100 flex items-center transition duration-200"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-blue-100 transition duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden bg-blue-600 border-t border-blue-500"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  "#hero",
                  "#about",
                  "#services",
                  "#doctors",
                  "#contact",
                  "#appointment",
                ].map((id) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={mobileNavLinkClass(id)}
                  >
                    {id.replace("#", "").charAt(0).toUpperCase() + id.slice(2)}
                  </button>
                ))}
                <div>
                  <button
                    onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-white hover:bg-blue-700 border-b border-blue-500 transition duration-200"
                  >
                    <span>Departments</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDepartmentsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDepartmentsOpen && (
                    <div className="bg-blue-700">
                      {departments.map((dept, idx) => (
                        <a
                          key={idx}
                          href={dept.link}
                          className="block px-8 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-800 border-b border-blue-600 last:border-b-0"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dept.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;