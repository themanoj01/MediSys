import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import { Search, X, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const HospitalResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingResourceId, setBookingResourceId] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8090/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data);
      setFilteredResources(res.data);
    } catch (err) {
      toast.error("Failed to load resources");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookResource = async (resourceId) => {
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

    try {
      await axios.post(
        "http://localhost:8090/api/resource-bookings/book",
        {
          resourceId,
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
      toast.success("Resource booked successfully!");
      setBookingResourceId(null);
      setStartDateTime("");
      setEndDateTime("");
      fetchResources(); // Refresh stock
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Try again.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = resources.filter((res) =>
      res.name.toLowerCase().includes(query)
    );
    setFilteredResources(filtered);
  };

  const handleCloseBooking = () => {
    setBookingResourceId(null);
    setStartDateTime("");
    setEndDateTime("");
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view resources");
      navigate("/login");
    } else {
      fetchResources();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hospital Resources
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Plan smarter for your treatment—reserve necessary resources in
            advance.
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button
                variant="outline"
                className="gap-2 px-6 py-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
              >
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8 relative max-w-lg">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by resource name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No matching resources found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
              >
                <img
                  src={
                    resource.image
                      ? `http://localhost:8090${resource.image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={resource.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {resource.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {resource.description || "No description provided."}
                  </p>
                  <div className="flex justify-between text-sm text-gray-700">
                    <p>
                      <strong>Stock:</strong> {resource.quantity}
                    </p>
                    <p>
                      <strong>Price:</strong> $
                      {resource.price?.toFixed(2) || "N/A"}
                    </p>
                  </div>

                  {bookingResourceId === resource.id ? (
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
                      <div className="flex gap-2">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleBookResource(resource.id)}
                          disabled={resource.quantity === 0}
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
                      onClick={() => setBookingResourceId(resource.id)}
                      disabled={resource.quantity === 0}
                    >
                      <CalendarCheck className="mr-2" size={18} />
                      {resource.quantity === 0
                        ? "Out of Stock"
                        : "Book Resource"}
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

export default HospitalResources;
