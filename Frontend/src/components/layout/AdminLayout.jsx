import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../pages/AdminDashboard/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
