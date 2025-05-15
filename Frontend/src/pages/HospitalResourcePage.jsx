import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";

const HospitalResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [bookingResourceId, setBookingResourceId] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:8090/api/hospital-resources", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
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
      toast.error("Start and end date/time are required");
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
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Resource booked successfully!");
      setBookingResourceId(null);
      setStartDateTime("");
      setEndDateTime("");
      fetchResources(); // refresh stock
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Booking failed. Try again."
      );
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

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hospital Resources</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by resource name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredResources.length === 0 ? (
        <p>No matching resources found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="bg-white p-4 shadow-md border border-gray-200 rounded-lg"
            >
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {resource.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {resource.description || "No description provided."}
                </p>
                <p className="text-gray-700 font-medium mb-4">
                  Stock: {resource.stock}
                </p>

                {bookingResourceId === resource.id ? (
                  <>
                    <input
                      type="datetime-local"
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      className="w-full border p-2 rounded text-sm mb-2"
                    />
                    <input
                      type="datetime-local"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      className="w-full border p-2 rounded text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="w-full"
                        onClick={() => handleBookResource(resource.id)}
                      >
                        Confirm Booking
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setBookingResourceId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setBookingResourceId(resource.id)}
                    disabled={resource.stock === 0}
                  >
                    {resource.stock === 0 ? "Out of Stock" : "Book Resource"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalResources;
