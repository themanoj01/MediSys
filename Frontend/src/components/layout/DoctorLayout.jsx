import React from "react";
import { Outlet } from "react-router-dom";

const DoctorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
