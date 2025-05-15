import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRooms: 0,
    totalResources: 0,
  });
  const [schedules, setSchedules] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("7days");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("All");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [patientsRes, doctorsRes, schedulesRes, roomsRes, resourcesRes] =
        await Promise.all([
          axios.get("http://localhost:8090/api/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8090/api/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8090/api/doctor-schedules", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8090/api/rooms", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8090/api/resources", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setStats({
        totalPatients: patientsRes.data.length,
        totalDoctors: doctorsRes.data.length,
        totalAppointments: schedulesRes.data.length,
        totalRooms: roomsRes.data.length,
        totalResources: resourcesRes.data.length,
      });
      setSchedules(schedulesRes.data);
      setResources(resourcesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Process Schedule Trend Data (Line Chart)
  const getFilteredSchedules = () => {
    let startDate;
    if (dateFilter === "7days") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (dateFilter === "30days") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    } else {
      // Custom date range (implement with input later)
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    }

    const filtered = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.createdAt || new Date());
      return scheduleDate >= startDate;
    });

    // Group by day
    const grouped = filtered.reduce((acc, schedule) => {
      const date = new Date(schedule.createdAt || new Date())
        .toISOString()
        .split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Generate last 7 days
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split("T")[0]);
    }

    const data = labels.map((date) => grouped[date] || 0);
    return { labels, data };
  };

  const lineChartData = {
    labels: getFilteredSchedules().labels,
    datasets: [
      {
        label: "Appointments",
        data: getFilteredSchedules().data,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
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

  const getFilteredResources = () => {
    const filtered =
      resourceTypeFilter === "All"
        ? resources
        : resources.filter((resource) => resource.name === resourceTypeFilter);

    const grouped = filtered.reduce((acc, resource) => {
      const name = resource.name || "Unknown";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(grouped),
      data: Object.values(grouped),
    };
  };

  const pieChartData = {
    labels: getFilteredResources().labels,
    datasets: [
      {
        data: getFilteredResources().data,
        backgroundColor: [
          "#4f46e5",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#8b5cf6",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Error Message */}
        {error && (
          <div
            className="p-4 mb-6 rounded-md shadow-sm bg-red-100 border-l-4 border-red-500 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { title: "Total Patients", value: stats.totalPatients, icon: "👥" },
            { title: "Total Doctors", value: stats.totalDoctors, icon: "👨‍⚕️" },
            {
              title: "Total Appointments",
              value: stats.totalAppointments,
              icon: "📅",
            },
            { title: "Total Rooms", value: stats.totalRooms, icon: "🏥" },
            {
              title: "Total Resources",
              value: stats.totalResources,
              icon: "🛠️",
            },
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

        {/* Filters and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart: Appointment Trend */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Appointment Trend
              </h2>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : schedules.length > 0 ? (
              <div className="h-80">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No appointment data available.
              </p>
            )}
          </div>

          {/* Pie Chart: Resource Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Resource Distribution
              </h2>
              <select
                value={resourceTypeFilter}
                onChange={(e) => setResourceTypeFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All Resources</option>
                {[...new Set(resources.map((r) => r.name || "Unknown"))].map(
                  (name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : resources.length > 0 ? (
              <div className="h-80">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No resource data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
