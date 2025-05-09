import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-primary text-2xl font-bold">MediSys</span>
                <span className="text-gray-600 ml-1">Hospital</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
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

            <div className="relative">
              <button
                className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium flex items-center ${
                  ["/appointment", "/my-bookings", "/faqs"].includes(
                    location.pathname
                  )
                    ? "text-primary"
                    : ""
                }`}
                onClick={toggleDropdown}
              >
                Patient <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/appointment"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeNavbar}
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeNavbar}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/faqs"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeNavbar}
                  >
                    FAQs
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                location.pathname === "/contact" ? "text-primary" : ""
              }`}
            >
              Contact
            </Link>

            <Link to="/login">
              <Button variant="outline" size="sm" className="ml-4">
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
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
              to="/appointment"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/appointment"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              Book Appointment
            </Link>
            <Link
              to="/my-bookings"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/my-bookings"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              My Bookings
            </Link>
            <Link
              to="/faqs"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === "/faqs"
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={closeNavbar}
            >
              FAQs
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
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
              onClick={closeNavbar}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
              onClick={closeNavbar}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
