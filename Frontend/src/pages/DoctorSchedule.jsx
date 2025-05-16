import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../components/ui/button";

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    slotDuration: "30",
  });
  const [editSchedule, setEditSchedule] = useState(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data);
    } catch (err) {
      setError("Failed to fetch doctors");
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (doctorId) => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8090/api/doctor-schedules/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Schedules fetched:", response.data);
      setSchedules(response.data);
    } catch (err) {
      setError("Failed to fetch schedules");
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "doctorId" && value) {
      fetchSchedules(value);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditSchedule({ ...editSchedule, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      doctorId: Number(form.doctorId),
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      slotDuration: Number(form.slotDuration),
    };

    try {
      await axios.post("http://localhost:8090/api/doctor-schedules", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Schedule created successfully");
      toast.success("Schedule created successfully");
      fetchSchedules(form.doctorId);
      resetForm();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create schedule";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      doctorId: Number(editSchedule.doctorId),
      dayOfWeek: editSchedule.dayOfWeek,
      startTime: editSchedule.startTime,
      endTime: editSchedule.endTime,
      slotDuration: Number(editSchedule.slotDuration),
    };

    try {
      await axios.put(
        `http://localhost:8090/api/doctor-schedules/${editSchedule.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Schedule updated successfully");
      toast.success("Schedule updated successfully");
      fetchSchedules(editSchedule.doctorId);
      setEditSchedule(null);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update schedule";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    console.log("Editing schedule:", schedule);
    try {
      const doctorId = form.doctorId;
      if (!doctorId) {
        throw new Error("Invalid schedule data: Doctor ID missing");
      }
      setEditSchedule({
        id: schedule.id,
        doctorId: doctorId.toString(),
        dayOfWeek: schedule.dayOfWeek || "",
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        slotDuration: schedule.slotDuration?.toString() || "30",
      });
      console.log("Edit modal set with:", {
        id: schedule.id,
        doctorId: doctorId.toString(),
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        slotDuration: schedule.slotDuration?.toString(),
      });
    } catch (err) {
      console.error("Error in handleEdit:", err.message);
      setError("Failed to load schedule for editing");
      toast.error("Failed to load schedule for editing");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.delete(`http://localhost:8090/api/doctor-schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Schedule deleted successfully");
      toast.success("Schedule deleted successfully");
      fetchSchedules(form.doctorId);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete schedule";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setDeleteScheduleId(null);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteScheduleId(id);
  };

  const closeDeleteModal = () => {
    setDeleteScheduleId(null);
  };

  const resetForm = () => {
    setForm({
      doctorId: form.doctorId,
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      slotDuration: "30",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Doctor Schedules
        </h1>

        {(error || success) && (
          <div
            className={`p-4 mb-6 rounded-md shadow-sm ${
              error
                ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                : "bg-green-100 border-l-4 border-green-500 text-green-700"
            }`}
            role="alert"
          >
            {error || success}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Schedule
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Doctor
              </label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Day of Week
              </label>
              <select
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Day</option>
                {[
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slot Duration (minutes)
              </label>
              <select
                name="slotDuration"
                value={form.slotDuration}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {[15, 30, 45, 60].map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 rounded-lg text-white font-semibold ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } transition`}
              >
                {loading ? "Adding..." : "Add Schedule"}
              </button>
            </div>
          </form>
        </div>

        {form.doctorId && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Schedules for Selected Doctor
            </h2>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : schedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Start Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        End Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Slot Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {schedules.map((schedule, index) => (
                      <tr
                        key={schedule.id}
                        className={`transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {schedule.dayOfWeek}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {schedule.startTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {schedule.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {schedule.slotDuration} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                console.log(
                                  "Edit button clicked for schedule:",
                                  schedule.id
                                );
                                handleEdit(schedule);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 flex items-center"
                              title="Edit"
                            >
                              <FaEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(schedule.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                              title="Delete"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No schedules found for this doctor.
              </p>
            )}
          </div>
        )}

        {editSchedule && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Schedule
                  </h2>
                  <button
                    onClick={() => setEditSchedule(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Doctor
                    </label>
                    <select
                      name="doctorId"
                      value={editSchedule.doctorId}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Day of Week
                    </label>
                    <select
                      name="dayOfWeek"
                      value={editSchedule.dayOfWeek}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Day</option>
                      {[
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                        "SUNDAY",
                      ].map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={editSchedule.startTime}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={editSchedule.endTime}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Slot Duration (minutes)
                    </label>
                    <select
                      name="slotDuration"
                      value={editSchedule.slotDuration}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {[15, 30, 45, 60].map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Updating..." : "Update Schedule"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold p-3 rounded-lg"
                      onClick={() => setEditSchedule(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {deleteScheduleId && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Confirm Deletion
                  </h2>
                  <button
                    onClick={closeDeleteModal}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this schedule? This action
                  cannot be undone.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleDelete(deleteScheduleId)}
                    disabled={loading}
                    className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold p-3 rounded-lg"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;
