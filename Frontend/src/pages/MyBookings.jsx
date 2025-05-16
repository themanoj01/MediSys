import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [resourceBookings, setResourceBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("appointments");
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwtToken");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch patient
      const patientRes = await axios.get(
        "http://localhost:8090/api/patients/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const patientData = patientRes.data;
      setPatient(patientData);
      console.log("Patient Data:", patientData);

      // Fetch appointments
      const appointmentsRes = await axios.get(
        "http://localhost:8090/api/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const mappedAppointments = appointmentsRes.data
        .filter((appt) => {
          const match = appt.patient.id === patientData.id;
          console.log(
            `Appointment ID ${appt.id} match: ${match}, patient.id: ${appt.patient.id}, expected: ${patientData.id}`
          );
          return match;
        })
        .map((appt) => ({
          id: appt.id,
          doctorName: appt.doctor.fullName || "N/A",
          startDateTime: appt.appointmentDateTime,
          endDateTime: new Date(
            new Date(appt.appointmentDateTime).getTime() + 30 * 60000
          ).toISOString(),
          price: appt.price || 50, // Default price
          status:
            appt.status === "SCHEDULED" ? "BOOKED" : appt.status.toUpperCase(),
        }));
      setAppointments(mappedAppointments);
      console.log("Appointments:", mappedAppointments);

      // Fetch room bookings
      const roomBookingsRes = await axios.get(
        "http://localhost:8090/api/room-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const mappedRoomBookings = roomBookingsRes.data
        .filter((booking) => {
          const match = booking.user.id === patientData.user.id;
          console.log(
            `Room Booking ID ${booking.id} match: ${match}, user.id: ${booking.user.id}, expected: ${patientData.user.id}`
          );
          return match;
        })
        .map((booking) => {
          return {
            id: booking.id,
            room: { number: booking.room.roomNumber, ...booking.room },
            startDateTime: booking.startDateTime,
            endDateTime: booking.endDateTime,
            price: booking.room.price || 0,
            status: booking.status.toUpperCase(),
          };
        });
      setRoomBookings(mappedRoomBookings);
      console.log("Room Bookings:", mappedRoomBookings);

      // Fetch resource bookings
      const resourceBookingsRes = await axios.get(
        "http://localhost:8090/api/resource-bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const mappedResourceBookings = resourceBookingsRes.data
        .filter((booking) => {
          const match = booking.user.id === patientData.user.id;
          console.log(
            `Resource Booking ID ${booking.id} match: ${match}, user.id: ${booking.user.id}, expected: ${patientData.user.id}`
          );
          return match;
        })
        .map((booking) => {
          const hours =
            (new Date(booking.endDateTime) - new Date(booking.startDateTime)) /
            (1000 * 60 * 60);
          return {
            id: booking.id,
            resource: { name: booking.resource.name, ...booking.resource },
            startDateTime: booking.startDateTime,
            endDateTime: booking.endDateTime,
            price: booking.resource.price * hours || 0,
            status: booking.status.toUpperCase(),
          };
        });
      setResourceBookings(mappedResourceBookings);
      console.log("Resource Bookings:", mappedResourceBookings);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to load bookings. Please try logging in again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    else {
      setError("Please log in to view bookings");
      toast.error("Please log in to view bookings");
      setLoading(false);
    }
  }, [token]);

  const filterBookings = (bookings) =>
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === filter);

  const getStatusCount = (bookings, status) =>
    bookings.filter((b) =>
      status === "all" ? true : b.status.toLowerCase() === status
    ).length;

  const handleCancelBooking = (id, type) => {
    setBookingToCancel({ id, type });
    setShowConfirmCancel(true);
  };

  const confirmCancelBooking = async () => {
    setIsSubmitting(true);
    try {
      const { id, type } = bookingToCancel;
      let endpoint;
      let setBookings;
      switch (type) {
        case "appointment":
          endpoint = `/api/appointments/${id}`;
          setBookings = setAppointments;
          break;
        case "room":
          endpoint = `/api/room-bookings/${id}`;
          setBookings = setRoomBookings;
          break;
        case "resource":
          endpoint = `/api/resource-bookings/${id}`;
          setBookings = setResourceBookings;
          break;
        default:
          throw new Error("Invalid booking type");
      }

      await axios.delete(`http://localhost:8090${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
      toast.success("Booking cancelled successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to cancel booking";
      toast.error(errorMessage);
      console.error("Cancel Error:", err);
    } finally {
      setIsSubmitting(false);
      setShowConfirmCancel(false);
      setBookingToCancel(null);
    }
  };

  const renderTable = (bookings, type) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {type === "appointment"
                ? "Doctor"
                : type === "room"
                ? "Room"
                : "Resource"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {type === "appointment"
                  ? booking.doctorName
                  : type === "room"
                  ? `Room ${booking.room?.number || "N/A"}`
                  : booking.resource?.name || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(booking.startDateTime).toLocaleString() || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(booking.endDateTime).toLocaleString() || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${booking.price?.toFixed(2) || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === "BOOKED"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {booking.status === "BOOKED" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id, type)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const currentBookings =
    activeTab === "appointments"
      ? filterBookings(appointments)
      : activeTab === "rooms"
      ? filterBookings(roomBookings)
      : filterBookings(resourceBookings);

  const getStatusCounts = (bookings) => ({
    all: getStatusCount(bookings, "all"),
    booked: getStatusCount(bookings, "booked"),
    completed: getStatusCount(bookings, "completed"),
    cancelled: getStatusCount(bookings, "cancelled"),
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage your appointments, room bookings, and resource
            bookings.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 animate-fade-in">
            <p>{error}</p>
            <p>Please ensure you are logged in as a patient and try again.</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["appointments", "rooms", "resources"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Status Overview */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                status: "all",
                label: "All Bookings",
                icon: Calendar,
                color: "border-gray-200",
              },
              {
                status: "booked",
                label: "Booked",
                icon: CheckCircle2,
                color: "border-green-500",
              },
              {
                status: "completed",
                label: "Completed",
                icon: Clock,
                color: "border-blue-500",
              },
              {
                status: "cancelled",
                label: "Cancelled",
                icon: XCircle,
                color: "border-red-500",
              },
            ].map(({ status, label, icon: Icon, color }) => (
              <div
                key={status}
                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer transform transition-all hover:scale-105 animate-fade-in ${
                  filter === status ? color : "border-gray-200"
                }`}
                onClick={() => setFilter(status)}
              >
                <div className="flex items-center">
                  <Icon
                    className={`h-8 w-8 mr-3 ${
                      status === "booked"
                        ? "text-green-500"
                        : status === "completed"
                        ? "text-blue-500"
                        : status === "cancelled"
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {
                        getStatusCounts(
                          activeTab === "appointments"
                            ? appointments
                            : activeTab === "rooms"
                            ? roomBookings
                            : resourceBookings
                        )[status]
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Bar */}
        {!error && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between animate-fade-in">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-3">
                Filter:
              </span>
              <select
                className="border-0 bg-transparent text-gray-700 text-sm font-medium focus:ring-0"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Bookings</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <Link to="/dashboard">
              <Button size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        )}

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 animate-fade-in">
            <Calendar className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Unable to Load Bookings
            </h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </div>
        ) : currentBookings.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <Calendar className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No {activeTab} found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === "all"
                ? `You don't have any ${activeTab} booked yet.`
                : `You don't have any ${filter} ${activeTab}.`}
            </p>
            <div className="mt-6">
              <Link
                to={
                  activeTab === "appointments"
                    ? "/appointment"
                    : activeTab === "rooms"
                    ? "/rooms"
                    : "/resources"
                }
              >
                <Button>
                  Book{" "}
                  {activeTab === "appointments"
                    ? "Appointment"
                    : activeTab === "rooms"
                    ? "Room"
                    : "Resource"}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          renderTable(
            currentBookings,
            activeTab === "appointments"
              ? "appointment"
              : activeTab === "rooms"
              ? "room"
              : "resource"
          )
        )}

        {/* Cancel Confirmation Modal */}
        {showConfirmCancel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full animate-fade-in">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Booking
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this {bookingToCancel?.type}{" "}
                booking? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmCancel(false);
                    setBookingToCancel(null);
                  }}
                  disabled={isSubmitting}
                >
                  No, Keep It
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmCancelBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Cancelling..." : "Yes, Cancel It"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
