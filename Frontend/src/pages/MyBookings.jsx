import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookingTable from "../components/ui/BookingTable";
import { bookings } from "../lib/data";
import { Button } from "../components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
} from "lucide-react";

const MyBookings = () => {
  const [filter, setFilter] = useState("all");
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myBookings, setMyBookings] = useState([...bookings]);

  // Filter bookings
  const filteredBookings =
    filter === "all"
      ? myBookings
      : myBookings.filter((booking) => booking.status.toLowerCase() === filter);

  const handleCancelBooking = (id) => {
    setBookingToCancel(id);
    setShowConfirmCancel(true);
  };

  const confirmCancelBooking = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setMyBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingToCancel
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
      setIsSubmitting(false);
      setShowConfirmCancel(false);
      setBookingToCancel(null);
    }, 1000);
  };

  const getStatusCount = (status) => {
    return myBookings.filter((booking) =>
      status === "all" ? true : booking.status.toLowerCase() === status
    ).length;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage your appointments with our doctors.
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer ${
              filter === "all" ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  All Appointments
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getStatusCount("all")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer ${
              filter === "confirmed" ? "border-green-500" : "border-gray-200"
            }`}
            onClick={() => setFilter("confirmed")}
          >
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getStatusCount("confirmed")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer ${
              filter === "pending" ? "border-yellow-500" : "border-gray-200"
            }`}
            onClick={() => setFilter("pending")}
          >
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getStatusCount("pending")}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer ${
              filter === "cancelled" ? "border-red-500" : "border-gray-200"
            }`}
            onClick={() => setFilter("cancelled")}
          >
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {getStatusCount("cancelled")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
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
              <option value="all">All Appointments</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <Link href="/appointment">
            <Button size="sm">Book New Appointment</Button>
          </Link>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <BookingTable
            bookings={filteredBookings}
            onCancel={handleCancelBooking}
          />
        </div>

        {/* Cancel Confirmation Modal */}
        {showConfirmCancel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Cancel Appointment
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
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

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === "all"
                ? "You don't have any appointments booked yet."
                : `You don't have any ${filter} appointments.`}
            </p>
            <div className="mt-6">
              <Link href="/appointment">
                <Button>Book an Appointment</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
