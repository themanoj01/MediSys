import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { DoorOpen, CalendarCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const roomRes = await axios.get("http://localhost:8090/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedRooms = roomRes.data;
      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);

      // Extract unique room types
      const types = [...new Set(fetchedRooms.map((room) => room.type))].sort();
      setRoomTypes(["All", ...types]);
    } catch (err) {
      toast.error("Failed to fetch rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view rooms");
      navigate("/login");
    } else {
      fetchRooms();
    }
  }, [token, navigate]);

  useEffect(() => {
    // Filter rooms based on selected type
    if (selectedType === "All") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter((room) => room.type === selectedType));
    }
  }, [selectedType, rooms]);

  const checkAvailability = async (roomId) => {
    if (!startDateTime || !endDateTime) {
      toast.error("Please select start and end date/time");
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const now = new Date();
    if (end <= start) {
      toast.error("End date/time must be after start date/time");
      return;
    }
    if (start < now) {
      toast.error("Start date/time must be in the future");
      return;
    }

    setCheckingAvailability(true);
    setAvailabilityStatus(null);
    try {
      const response = await axios.get(
        "http://localhost:8090/api/room-bookings/check-availability",
        {
          params: {
            roomId,
            start: start.toISOString(),
            end: end.toISOString(),
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailabilityStatus(response.data ? "available" : "booked");
    } catch (err) {
      toast.error("Failed to check availability");
      console.error(err);
      setAvailabilityStatus("error");
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBookRoom = async (roomId) => {
    if (availabilityStatus !== "available") {
      toast.error("Room is not available for the selected time");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8090/api/room-bookings/book",
        {
          roomId,
          startDateTime,
          endDateTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Room booked successfully!");
      setBookingRoomId(null);
      setStartDateTime("");
      setEndDateTime("");
      setAvailabilityStatus(null);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const handleCloseBooking = () => {
    setBookingRoomId(null);
    setStartDateTime("");
    setEndDateTime("");
    setAvailabilityStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hospital Room Directory
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Plan your stay with ease—reserve the perfect room in advance.
          </p>
          <div className="mt-6 flex items-center justify-between w-full">
            <Link to="/">
              <Button
                variant="outline"
                className="gap-2 px-6 py-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3 max-w-lg">
              <label
                htmlFor="roomTypeFilter"
                className="text-sm font-medium text-gray-700"
              >
                Filter by Room Type
              </label>
              <select
                id="roomTypeFilter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Room List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No matching rooms found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
              >
                <img
                  src={
                    room.roomPicture
                      ? `http://localhost:8090${room.roomPicture}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <DoorOpen className="text-blue-600" size={20} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Room {room.roomNumber}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {room.type}
                  </p>
                  <div className="flex justify-between text-sm text-gray-700">
                    <p>
                      <strong>Price:</strong> ${room.price?.toFixed(2) || "N/A"}
                      /night
                    </p>
                  </div>

                  {bookingRoomId === room.id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={startDateTime}
                          onChange={(e) => setStartDateTime(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={endDateTime}
                          onChange={(e) => setEndDateTime(e.target.value)}
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      {availabilityStatus && (
                        <p
                          className={`text-sm font-medium ${
                            availabilityStatus === "available"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {availabilityStatus === "available"
                            ? "Room is available!"
                            : "Room is booked for this time."}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => checkAvailability(room.id)}
                          disabled={checkingAvailability}
                        >
                          {checkingAvailability ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                              Checking...
                            </span>
                          ) : (
                            "Check Availability"
                          )}
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleBookRoom(room.id)}
                          disabled={
                            availabilityStatus !== "available" ||
                            checkingAvailability
                          }
                        >
                          Confirm Booking
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleCloseBooking}
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setBookingRoomId(room.id)}
                    >
                      <CalendarCheck className="mr-2" size={18} />
                      Book Room
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
