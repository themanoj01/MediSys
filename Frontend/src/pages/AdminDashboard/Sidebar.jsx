import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaBuilding,
  FaBox,
  FaUsers,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: <FaUserMd className="w-5 h-5" />,
    },
    {
      name: "Doctor Schedule",
      path: "/admin/doctor-schedule",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      name: "Rooms",
      path: "/admin/rooms",
      icon: <FaBuilding className="w-5 h-5" />,
    },
    {
      name: "Resources",
      path: "/admin/resources",
      icon: <FaBox className="w-5 h-5" />,
    },
    {
      name: "Patients",
      path: "/admin/patients",
      icon: <FaUsers className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg focus:outline-none hover:bg-indigo-700 transition"
      >
        {isOpen ? (
          <FaTimes className="w-5 h-5" />
        ) : (
          <FaBars className="w-5 h-5" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-60 z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h2>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : ""
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center p-3 mt-6 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
