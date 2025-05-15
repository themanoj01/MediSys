import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { TooltipProvider } from "./components/ui/tooltip";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Appointment from "./pages/Appointment";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterDoctor from "./pages/AdminDashboard/RegisterDoctor";
import RegisterPatient from "./pages/AdminDashboard/RegisterPatient";
import HospitalResources from "./pages/AdminDashboard/HospitalResources";
import HospitalRooms from "./pages/AdminDashboard/HospitalRooms";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSchedule from "./pages/DoctorSchedule";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import RoomList from "./pages/RoomListPage";
import HospitalResources from "./pages/HospitalResourcePage";
import AdminLayout from "./components/layout/AdminLayout";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/doctors" element={<RegisterDoctor />} />
            <Route path="/admin/patients" element={<RegisterPatient />} />
            <Route path="/admin/rooms" element={<HospitalRooms />} />
            <Route path="/admin/resources" element={<HospitalResources />} />
            <Route path="/admin/doctor-schedule" element={<DoctorSchedule />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router>
         <Toaster position="top-center"/>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/doctor-schedule" element={<DoctorSchedule />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/hospital-resource" element={<HospitalResources />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <AppContent />
      </Router>
    </TooltipProvider>
  );
}

export default App;
