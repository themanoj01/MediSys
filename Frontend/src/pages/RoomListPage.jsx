import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Trash2, Plus, DoorOpen, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const fetchRooms = async () => {
  try {
    const roomRes = await axios.get("http://localhost:8090/api/hospital-rooms", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    const allRooms = roomRes.data;
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const availableRooms = [];

    for (const room of allRooms) {
      try {
        const slotRes = await axios.get(
          "http://localhost:8090/api/room-bookings/available-slots",
          {
            params: {
              roomId: room.id,
              start: now.toISOString(),
              end: threeDaysLater.toISOString(),
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        if (slotRes.data && slotRes.data.length === 0) {
          availableRooms.push(room);
        }
      } catch (err) {
        console.warn(`Failed to check availability for room ${room.id}`);
      }
    }

    setRooms(availableRooms);
  } catch (err) {
    toast.error("Failed to fetch rooms");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleBookRoom = async (roomId) => {
    if (!startDateTime || !endDateTime) {
      toast.error("Start and end date/time are required");
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
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Room booked successfully!");
      setBookingRoomId(null);
      setStartDateTime("");
      setEndDateTime("");

      fetchRooms(); // refresh available rooms
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Booking failed. Try again."
      );
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Available Hospital Rooms</h2>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-600">No available rooms at this moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DoorOpen className="text-blue-600" size={22} />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Room {room.roomNumber}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {room.type}
                  </p>
                </div>

                {bookingRoomId === room.id ? (
                  <div className="space-y-2 mt-4">
                    <input
                      type="datetime-local"
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      className="w-full border p-2 rounded text-sm"
                    />
                    <input
                      type="datetime-local"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      className="w-full border p-2 rounded text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="w-full"
                        onClick={() => handleBookRoom(room.id)}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setBookingRoomId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      className="w-full"
                      onClick={() => setBookingRoomId(room.id)}
                    >
                      <CalendarCheck className="mr-2" size={18} />
                      Book Room
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
