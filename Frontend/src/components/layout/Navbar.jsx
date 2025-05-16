import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem("jwtToken");
      const role = localStorage.getItem("userRole");
      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    updateAuthState();
    window.addEventListener("authChange", updateAuthState);
    return () => window.removeEventListener("authChange", updateAuthState);
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
    closeNavbar();
    navigate("/login");
    window.dispatchEvent(new Event("authChange"));
  };

  const renderAuthLinks = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={closeNavbar}
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary-dark"
              onClick={closeNavbar}
            >
              Register
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          className="flex items-center text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
          onClick={toggleProfileDropdown}
        >
          <User className="mr-1 h-4 w-4" />
          Profile
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        {profileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[1000]">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={closeNavbar}
            >
              My Profile
            </Link>
            <Link
              to="/my-bookings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={closeNavbar}
            >
              My Bookings
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="inline mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMobileAuthLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/login"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
            onClick={closeNavbar}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
            onClick={closeNavbar}
          >
            Register
          </Link>
        </>
      );
    }

    return (
      <>
        <button
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary flex items-center"
          onClick={toggleProfileDropdown}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        {profileDropdownOpen && (
          <div className="pl-4">
            <Link
              to="/profile"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
              onClick={closeNavbar}
            >
              My Profile
            </Link>
            <Link
              to="/my-bookings"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
              onClick={closeNavbar}
            >
              My Bookings
            </Link>
            <button
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="inline mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary text-2xl font-bold">MediSys</span>
              <span className="text-gray-600 ml-1">Hospital</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/" ? "text-primary" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/about" ? "text-primary" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/services"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/services" ? "text-primary" : ""
              }`}
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/doctors" ? "text-primary" : ""
              }`}
            >
              Doctors
            </Link>
            <Link
              to="/rooms"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/rooms" ? "text-primary" : ""
              }`}
            >
              Rooms
            </Link>
            <Link
              to="/resources"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/resources" ? "text-primary" : ""
              }`}
            >
              Resources
            </Link>
            <Link
              to="/faqs"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/faq" ? "text-primary" : ""
              }`}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/contact" ? "text-primary" : ""
              }`}
            >
              Contact
            </Link>
            {renderAuthLinks()}
          </div>

          <div className="flex md:hidden items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleNavbar}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/about"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              About
            </Link>
            <Link
              to="/services"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/services"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/doctors"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Doctors
            </Link>
            <Link
              to="/rooms"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/rooms"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Rooms
            </Link>
            <Link
              to="/resources"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/resources"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Resources
            </Link>
            <Link
              to="/faq"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/faq"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/contact"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Contact
            </Link>
            {renderMobileAuthLinks()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
