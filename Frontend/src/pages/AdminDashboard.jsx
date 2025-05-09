import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CalendarDays,
  Stethoscope,
  Bed,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  BadgeAlert,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { doctors, bookings } from "../lib/data";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock admin data
  const adminStats = {
    patientsTotal: 1548,
    doctorsTotal: doctors.length,
    appointmentsToday: 42,
    appointmentsWeek: 210,
    occupancyRate: 76,
    revenueToday: 12450,
    pendingAppointments: 18,
    alerts: 5,
  };

  const recentAppointments = bookings.slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-primary" />
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {adminStats.alerts}
              </span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                A
              </div>
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">
                  Total Patients
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {adminStats.patientsTotal}
                </p>
                <p className="text-sm text-green-600">+2.6% from last month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">
                  Total Doctors
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {adminStats.doctorsTotal}
                </p>
                <p className="text-sm text-green-600">+1 new this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">
                  Appointments Today
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {adminStats.appointmentsToday}
                </p>
                <p className="text-sm text-yellow-600">
                  {adminStats.pendingAppointments} pending
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bed className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">
                  Occupancy Rate
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {adminStats.occupancyRate}%
                </p>
                <div className="w-32 mt-1">
                  <Progress value={adminStats.occupancyRate} className="h-2" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "overview"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <BarChart3
                    className={`h-5 w-5 ${
                      activeTab === "overview" ? "text-white" : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Overview</span>
                </button>

                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "appointments"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  <Calendar
                    className={`h-5 w-5 ${
                      activeTab === "appointments"
                        ? "text-white"
                        : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Appointments</span>
                </button>

                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "doctors"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("doctors")}
                >
                  <Stethoscope
                    className={`h-5 w-5 ${
                      activeTab === "doctors" ? "text-white" : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Doctors</span>
                </button>

                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "patients"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("patients")}
                >
                  <Users
                    className={`h-5 w-5 ${
                      activeTab === "patients" ? "text-white" : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Patients</span>
                </button>

                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "reports"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("reports")}
                >
                  <FileText
                    className={`h-5 w-5 ${
                      activeTab === "reports" ? "text-white" : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Reports</span>
                </button>

                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "messages"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare
                    className={`h-5 w-5 ${
                      activeTab === "messages" ? "text-white" : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Messages</span>
                </button>

                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === "settings"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings
                    className={`h-5 w-5 ${
                      activeTab === "settings" ? "text-white" : "text-gray-500"
                    } mr-3`}
                  />
                  <span>Settings</span>
                </button>
              </nav>
            </Card>

            <Card className="p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900">System Alerts</h2>
                <BadgeAlert className="h-5 w-5 text-red-500" />
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        System maintenance scheduled for 10:00 PM tonight
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Emergency department at 92% capacity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        New staff training is due in 3 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs defaultValue="today" className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Appointments
                  </h2>
                  <TabsList>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="today" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                          >
                            Patient
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                          >
                            Doctor
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentAppointments.map((appointment, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Patient {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.doctorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === "Confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-600 hover:text-primary"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="upcoming">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-500">
                      Upcoming Appointments Tab
                    </h3>
                    <p className="text-gray-400 mt-2">
                      This is a placeholder for upcoming appointments view
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-500">
                      Completed Appointments Tab
                    </h3>
                    <p className="text-gray-400 mt-2">
                      This is a placeholder for completed appointments view
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Revenue Overview
                </h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500">Today's Revenue</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${adminStats.revenueToday}
                  </span>
                </div>
                <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-400">Revenue Chart Placeholder</p>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">This Week</p>
                    <p className="text-lg font-bold text-gray-900">$48,565</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">This Month</p>
                    <p className="text-lg font-bold text-gray-900">$192,450</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">This Year</p>
                    <p className="text-lg font-bold text-gray-900">$2.4M</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Doctor Performance
                </h2>
                <div className="space-y-4">
                  {doctors.slice(0, 4).map((doctor, index) => (
                    <div key={index} className="flex items-center">
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {doctor.name}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 mr-4">
                            <Progress value={90 - index * 5} className="h-2" />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right">
                            {90 - index * 5}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View All Doctors
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
