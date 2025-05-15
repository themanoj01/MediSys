import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch current doctor
      const doctorRes = await axios.get(
        "http://localhost:8090/api/doctors/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const doctor = doctorRes.data;
      setDoctorId(doctor.id);

      // Fetch appointments
      const appointmentsRes = await axios.get(
        "http://localhost:8090/api/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const doctorAppointments = appointmentsRes.data.filter(
        (appt) => appt.doctor.id === doctor.id
      );
      setAppointments(doctorAppointments.slice(0, 5));

      // Fetch schedules
      const schedulesRes = await axios.get(
        "http://localhost:8090/api/doctor-schedules",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const doctorSchedules = schedulesRes.data.filter(
        (sched) => sched.doctor.id === doctor.id
      );
      setSchedules(doctorSchedules);

      // Calculate stats
      const today = new Date().toDateString();
      setStats({
        todayAppointments: doctorAppointments.filter(
          (appt) => new Date(appt.appointmentDateTime).toDateString() === today
        ).length,
        pendingAppointments: doctorAppointments.filter(
          (appt) => appt.status === "SCHEDULED"
        ).length,
        totalPatients: new Set(
          doctorAppointments.map((appt) => appt.patient.id)
        ).size,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in as a doctor.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
      // Mock data for testing
      setDoctorId(1);
      setAppointments([
        {
          id: 1,
          patient: { id: 1, fullName: "John Doe" },
          doctor: { id: 1 },
          appointmentDateTime: "2025-05-15T10:00:00",
          status: "SCHEDULED",
          createdAt: "2025-05-14T08:00:00",
        },
        {
          id: 2,
          patient: { id: 2, fullName: "Jane Smith" },
          doctor: { id: 1 },
          appointmentDateTime: "2025-05-16T12:00:00",
          status: "SCHEDULED",
          createdAt: "2025-05-14T09:00:00",
        },
      ]);
      setSchedules([
        {
          id: 1,
          doctor: { id: 1 },
          dayOfWeek: "MONDAY",
          startTime: "09:00",
          endTime: "17:00",
        },
        {
          id: 2,
          doctor: { id: 1 },
          dayOfWeek: "TUESDAY",
          startTime: "10:00",
          endTime: "18:00",
        },
      ]);
      setStats({
        todayAppointments: 1,
        pendingAppointments: 2,
        totalPatients: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Schedule Form
  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({ ...scheduleForm, [name]: value });
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleData = {
        doctorId: doctorId,
        dayOfWeek: scheduleForm.dayOfWeek,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        slotDuration: 30,
      };
      if (editingScheduleId) {
        // Update schedule
        await axios.put(
          `http://localhost:8090/api/doctor-schedules/${editingScheduleId}`,
          scheduleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create schedule
        await axios.post(
          "http://localhost:8090/api/doctor-schedules",
          scheduleData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setScheduleForm({ dayOfWeek: "", startTime: "", endTime: "" });
      setEditingScheduleId(null);
      fetchData(); // Refresh schedules
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save schedule");
    }
  };

  const handleEditSchedule = (schedule) => {
    setScheduleForm({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    });
    setEditingScheduleId(schedule.id);
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:8090/api/doctor-schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); // Refresh schedules
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete schedule");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  // Line Chart: Appointment Trend (7 days)
  const getChartData = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const filtered = appointments.filter(
      (appt) => new Date(appt.createdAt) >= startDate
    );

    const grouped = filtered.reduce((acc, appt) => {
      const date = new Date(appt.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split("T")[0]);
    }

    const data = labels.map((date) => grouped[date] || 0);
    return {
      labels,
      datasets: [
        {
          label: "Appointments",
          data,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Appointments" } },
      x: { title: { display: true, text: "Date" } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Logout
          </button>
        </div>

        {error && (
          <div
            className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Today's Appointments",
              value: stats.todayAppointments,
              icon: "📅",
            },
            {
              title: "Pending Appointments",
              value: stats.pendingAppointments,
              icon: "⏳",
            },
            { title: "Total Patients", value: stats.totalPatients, icon: "👥" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? "Loading..." : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Upcoming Appointments Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Appointments
          </h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr
                    key={appt.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {appt.patient.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(appt.appointmentDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {appt.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No appointments available.
            </p>
          )}
        </div>
        {/* Doctor Schedule Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My Schedule
          </h2>
          {/* Schedule Form */}
          <form onSubmit={handleScheduleSubmit} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Day of Week
                </label>
                <select
                  name="dayOfWeek"
                  value={scheduleForm.dayOfWeek}
                  onChange={handleScheduleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
                  value={scheduleForm.startTime}
                  onChange={handleScheduleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
                  value={scheduleForm.endTime}
                  onChange={handleScheduleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingScheduleId ? "Update Schedule" : "Add Schedule"}
              </button>
              {editingScheduleId && (
                <button
                  type="button"
                  onClick={() => {
                    setScheduleForm({
                      dayOfWeek: "",
                      startTime: "",
                      endTime: "",
                    });
                    setEditingScheduleId(null);
                  }}
                  className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {/* Schedule Table */}
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : schedules.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Day of Week
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr
                    key={schedule.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {schedule.dayOfWeek}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {schedule.startTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {schedule.endTime}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="text-indigo-600 hover:text-indigo-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No schedules available.
            </p>
          )}
        </div>
        {/* Line Chart: Appointment Trend */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Appointment Trend (Last 7 Days)
          </h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="h-80">
              <Line data={getChartData()} options={lineChartOptions} />
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No appointment data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
