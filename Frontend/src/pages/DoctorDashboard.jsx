import React, { useState } from 'react';
import { 
  Users, 
  CalendarDays, 
  Clock, 
  CheckCircle2,
  ClipboardList,
  Settings,
  Bell,
  LogOut
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { bookings } from '../lib/data';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentView, setCurrentView] = useState('today');
  
  // Fake doctor data
  const doctorData = {
    id: "d1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    appointments: {
      today: 8,
      tomorrow: 6,
      upcoming: 15,
      total: 120,
      completed: 98
    },
    patients: {
      total: 256,
      new: 12
    },
    schedule: {
      start: "09:00 AM",
      end: "05:00 PM",
      breaks: [
        { start: "12:00 PM", end: "01:00 PM", label: "Lunch" }
      ]
    },
    notifications: 3
  };
  
  // Today's appointments - derived from the bookings data where the doctor is Dr. Sarah Johnson
  const todaysAppointments = bookings
    .filter(booking => booking.doctorName === "Dr. Sarah Johnson")
    .map((booking, index) => ({
      ...booking,
      patientName: `Patient ${index + 1}`,
      patientId: `P${100 + index}`,
      reason: "Regular checkup"
    }));
  
  const getAppointmentsForView = () => {
    // In a real app, this would filter by date
    return todaysAppointments;
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Doctor Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Doctor Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-primary" />
              {doctorData.notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {doctorData.notifications}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                {doctorData.name.charAt(0)}
              </div>
              <span className="font-medium text-gray-700">{doctorData.name}</span>
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
                <h2 className="text-xs font-medium text-gray-500 uppercase">Total Patients</h2>
                <p className="text-xl font-bold text-gray-900">{doctorData.patients.total}</p>
                <p className="text-sm text-green-600">+{doctorData.patients.new} new this month</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">Today's Appointments</h2>
                <p className="text-xl font-bold text-gray-900">{doctorData.appointments.today}</p>
                <p className="text-sm text-blue-600">{doctorData.appointments.tomorrow} scheduled for tomorrow</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">Completed Appointments</h2>
                <p className="text-xl font-bold text-gray-900">{doctorData.appointments.completed}</p>
                <p className="text-sm text-gray-500">Total: {doctorData.appointments.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xs font-medium text-gray-500 uppercase">Work Hours</h2>
                <p className="text-xl font-bold text-gray-900">{doctorData.schedule.start} - {doctorData.schedule.end}</p>
                <p className="text-sm text-gray-500">Break: {doctorData.schedule.breaks[0].start} - {doctorData.schedule.breaks[0].end}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === 'overview' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <ClipboardList className={`h-5 w-5 ${activeTab === 'overview' ? 'text-white' : 'text-gray-500'} mr-3`} />
                  <span>Dashboard</span>
                </button>
                
                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === 'appointments' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('appointments')}
                >
                  <CalendarDays className={`h-5 w-5 ${activeTab === 'appointments' ? 'text-white' : 'text-gray-500'} mr-3`} />
                  <span>Appointments</span>
                </button>
                
                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === 'patients' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('patients')}
                >
                  <Users className={`h-5 w-5 ${activeTab === 'patients' ? 'text-white' : 'text-gray-500'} mr-3`} />
                  <span>Patients</span>
                </button>
                
                <button
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${
                    activeTab === 'settings' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-white' : 'text-gray-500'} mr-3`} />
                  <span>Settings</span>
                </button>
                
                <button
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 text-red-500 mr-3" />
                  <span>Logout</span>
                </button>
              </nav>
              
              {/* Working Hours Card */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Today's Schedule</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Working Hours:</span>
                    <span className="font-medium">{doctorData.schedule.start} - {doctorData.schedule.end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lunch Break:</span>
                    <span className="font-medium">{doctorData.schedule.breaks[0].start} - {doctorData.schedule.breaks[0].end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Appointments:</span>
                    <span className="font-medium">{doctorData.appointments.today}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <Tabs defaultValue="today" onValueChange={setCurrentView} value={currentView}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
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
                          <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            Patient
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            Reason
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getAppointmentsForView().map((appointment, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.patientName}
                              <div className="text-xs text-gray-500">ID: {appointment.patientId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" className="text-xs">
                                  View
                                </Button>
                                <Button size="sm" className="text-xs">
                                  Start
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-500">Upcoming Appointments Tab</h3>
                    <p className="text-gray-400 mt-2">This is a placeholder for upcoming appointments view</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="completed">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-500">Completed Appointments Tab</h3>
                    <p className="text-gray-400 mt-2">This is a placeholder for completed appointments view</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Patients</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Patient {index + 1}</p>
                        <p className="text-xs text-gray-500">Last visit: {index === 0 ? 'Today' : `${index} days ago`}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full">View All Patients</Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Notifications</h3>
                {doctorData.notifications > 0 ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CalendarDays className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            New appointment request from Patient 4
                          </p>
                          <p className="text-xs text-blue-500 mt-1">10 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Reminder: Staff meeting at 4:00 PM
                          </p>
                          <p className="text-xs text-yellow-500 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Lab results for Patient 2 are ready
                          </p>
                          <p className="text-xs text-green-500 mt-1">3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-8 w-8 text-gray-300 mx-auto" />
                    <p className="mt-2 text-gray-500">No new notifications</p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full">View All Notifications</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;