// App.js
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
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterDoctor from "./pages/AdminDashboard/RegisterDoctor";
import RegisterPatient from "./pages/AdminDashboard/RegisterPatient";
import HospitalRooms from "./pages/AdminDashboard/HospitalRooms";
import HospitalResources from "./pages/AdminDashboard/HospitalResources";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSchedule from "./pages/DoctorSchedule";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import RoomList from "./pages/RoomListPage";
import AdminLayout from "./components/layout/AdminLayout";
import DoctorLayout from "./components/layout/DoctorLayout";
import HospitalResource from "./pages/HospitalResourcePage";
import PaymentPage from "./pages/PaymentPage";

function AppContent() {
  const location = useLocation();
  const hideLayoutRoutes =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/doctor");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayoutRoutes && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/resources" element={<HospitalResource />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Admin Layout Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/doctors" element={<RegisterDoctor />} />
            <Route path="/admin/patients" element={<RegisterPatient />} />
            <Route path="/admin/rooms" element={<HospitalRooms />} />
            <Route path="/admin/resources" element={<HospitalResources />} />
            <Route path="/admin/doctor-schedule" element={<DoctorSchedule />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Doctor Layout Routes */}
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideLayoutRoutes && <Footer />}
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              border: "1px solid #e2e8f0",
              padding: "8px",
              color: "#4a5568",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
        <AppContent />
      </Router>
    </TooltipProvider>
  );
}

export default App;
