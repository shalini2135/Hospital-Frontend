import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Activity,
  Users,
  Calendar,
  FileText,
  CreditCard,
  History,
} from "lucide-react";

const Header = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBillingDropdownOpen, setIsBillingDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigationItems = [
    {
      id: "registration",
      label: "Patient Registration",
      path: "/reception/registration",
      icon: Users,
    },
    {
      id: "management",
      label: "Patient Management",
      path: "/reception/management",
      icon: Activity,
    },
    {
      id: "appointment",
      label: "Appointments",
      path: "/reception/appointment",
      icon: Calendar,
    },
    {
      id: "billing",
      label: "Billing",
      path: "/reception/billing",
      icon: CreditCard,
      hasDropdown: true,
      dropdownItems: [
        {
          label: "Generate Bill",
          path: "/reception/generate-bill",
          icon: FileText,
        },
        {
          label: "Bill History",
          path: "/reception/bill-history",
          icon: History,
        },
      ],
    },
  ];

  const isActiveRoute = (path) => location.pathname.startsWith(path);

  const getActiveItem = () => {
    for (const item of navigationItems) {
      if (item.hasDropdown && item.dropdownItems) {
        for (const dropdownItem of item.dropdownItems) {
          if (isActiveRoute(dropdownItem.path)) {
            return item.id;
          }
        }
      }
      if (isActiveRoute(item.path)) {
        return item.id;
      }
    }
    return null;
  };

  const activeItem = getActiveItem();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsBillingDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      {/* Top Nav */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={onDrawerToggle}
                className="md:hidden p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center ml-2 md:ml-0">
                
                <h1 className="text-xl font-bold text-white tracking-wide">
                  MediTrack
                </h1>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 pr-2">
              

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        // TODO: Add your logout logic here
                        // e.g., clear auth tokens, user state, etc.

                        setIsProfileDropdownOpen(false); // close dropdown if needed
                        navigate("/"); // or navigate("/"), based on your route
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 className="text-2xl font-bold text-gray-800">Reception</h2>
            <nav className="hidden md:flex space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                if (item.hasDropdown) {
                  return (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() =>
                          setIsBillingDropdownOpen(!isBillingDropdownOpen)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                          isActive
                            ? "text-blue-600 border-b-2 border-blue-600 hover:text-blue-600 hover:bg-transparent"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {isBillingDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          {item.dropdownItems?.map((dropdownItem) => {
                            const DropdownIcon = dropdownItem.icon;
                            return (
                              <button
                                key={dropdownItem.path}
                                onClick={() =>
                                  handleNavigation(dropdownItem.path)
                                }
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                              >
                                <DropdownIcon className="h-4 w-4" />
                                <span>{dropdownItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600 hover:text-blue-600 hover:bg-transparent"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() =>
                        setIsBillingDropdownOpen(!isBillingDropdownOpen)
                      }
                      className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "text-blue-600 bg-blue-50 hover:text-blue-600 hover:bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {isBillingDropdownOpen && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.dropdownItems?.map((dropdownItem) => {
                          const DropdownIcon = dropdownItem.icon;
                          return (
                            <button
                              key={dropdownItem.path}
                              onClick={() =>
                                handleNavigation(dropdownItem.path)
                              }
                              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            >
                              <DropdownIcon className="h-4 w-4" />
                              <span>{dropdownItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
