import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Award,
  Phone,
  MapPin,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookedTimeStamps, setBookedTimeStamps] = useState([]);

  const token = localStorage.getItem("jwtToken");
  const decoded = jwtDecode(token);
  const currentUser = { id: decoded.userId, role: decoded.roles };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorRes = await axios.get(`http://localhost:8090/api/doctors/${id}`);
        setDoctor(doctorRes.data);
        if (doctorRes.data.schedules?.length > 0) {
          setSelectedDay(doctorRes.data.schedules[0].dayOfWeek);
        }

        // Fetch all future appointments and convert to timestamps
        const apptRes = await axios.get(`http://localhost:8090/api/appointments/get-by-doctor/${id}`);
        const futureBooked = apptRes.data
          .filter(a => new Date(a.appointmentDateTime) > new Date())
          .map(a => new Date(a.appointmentDateTime).setMilliseconds(0)); // normalized timestamps

        setBookedTimeStamps(futureBooked);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch doctor or appointments.");
      }
    };

    fetchDoctor();
  }, [id]);

  const generateTimeSlots = (start, end, duration) => {
    const slots = [];
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    while (startTime < endTime) {
      const hours = startTime.getHours().toString().padStart(2, "0");
      const minutes = startTime.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      startTime.setMinutes(startTime.getMinutes() + duration);
    }

    return slots;
  };

  const getAvailableTimesForSelectedDay = () => {
    const schedule = doctor?.schedules?.find((s) => s.dayOfWeek === selectedDay);
    if (!schedule) return [];
    return generateTimeSlots(schedule.startTime, schedule.endTime, schedule.slotDuration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || !currentUser.role?.includes("PATIENT")) {
      toast.error("You must be logged in as a patient to book an appointment.");
      return;
    }

    const selectedSchedule = doctor.schedules.find((s) => s.dayOfWeek === selectedDay);
    if (!selectedSchedule) {
      toast.error("No schedule found for selected day");
      return;
    }

    const [hour, minute] = selectedTime.split(":");

    const now = new Date();
    const selectedDayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
      .indexOf(selectedDay);
    const todayIndex = now.getDay();
    const offset = (selectedDayIndex - todayIndex + 7) % 7;

    const localAppointment = new Date();
    localAppointment.setDate(now.getDate() + offset);
    localAppointment.setHours(Number(hour));
    localAppointment.setMinutes(Number(minute));
    localAppointment.setSeconds(0);
    localAppointment.setMilliseconds(0);

    const timezoneOffset = localAppointment.getTimezoneOffset();
    const appointmentUTC = new Date(localAppointment.getTime() - timezoneOffset * 60000);
    const appointmentDateTime = appointmentUTC.toISOString();

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8090/api/appointments/book", {
        doctorId: doctor.id,
        patientId: currentUser.id,
        appointmentDateTime
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json"
        }
      });

      setIsSubmitting(false);
      setBookingSuccess(true);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data || "Failed to book appointment. May be this slot is packed try another slot.");
      console.error("Booking failed:", error);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
            <p className="text-gray-600 mb-8">
              The doctor you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/doctors">
              <Button className="inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Doctors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/doctors">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Doctors
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={doctor.imageUrl || "/default-doctor.jpg"}
                alt={doctor.fullName}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
              <div className="flex flex-wrap justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{doctor.fullName}</h1>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full mt-2 md:mt-0">
                  <span className="text-sm font-medium">
                    {doctor.yearsOfExperience} Years Experience
                  </span>
                </div>
              </div>

              <div className="flex items-center mt-6">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Reg#: {doctor.registrationNumber}
                </span>
              </div>

              <p className="mt-6 text-gray-700 leading-relaxed">
                {doctor.description ||
                  `Dr. ${doctor.fullName} specializes in ${doctor.specialization} with ${doctor.yearsOfExperience} years of experience.`}
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard icon={<UserCheck />} title="Consultations" value="In-person & Video" />
                <InfoCard icon={<Phone />} title="Contact" value={doctor.phone || "N/A"} />
                <InfoCard icon={<MapPin />} title="Location" value="MediSys Hospital, Level 3" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>

              {bookingSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Requested</h3>
                  <p className="text-gray-600 mb-6">
                    Your appointment with {doctor.fullName} for {selectedDay} at {selectedTime} has been submitted.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button onClick={() => setBookingSuccess(false)} variant="outline">
                      Book Another
                    </Button>
                    <Link to="/my-bookings">
                      <Button>View My Bookings</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        Available Days
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doctor.schedules.map((schedule, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedDay === schedule.dayOfWeek
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                              }`}
                            onClick={() => {
                              setSelectedDay(schedule.dayOfWeek);
                              setSelectedTime("");
                            }}
                          >
                            <div className="font-medium">{schedule.dayOfWeek}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        Available Times
                      </h3>
                      {selectedDay ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {getAvailableTimesForSelectedDay().map((time, index) => {
                            const baseDate = new Date();
                            const selectedDayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(selectedDay);
                            const todayIndex = baseDate.getDay();
                            const offset = (selectedDayIndex - todayIndex + 7) % 7;

                            baseDate.setDate(baseDate.getDate() + offset);
                            const [hour, minute] = time.split(":");
                            baseDate.setHours(+hour);
                            baseDate.setMinutes(+minute);
                            baseDate.setSeconds(0);
                            baseDate.setMilliseconds(0);

                            const timezoneOffset = baseDate.getTimezoneOffset();
                            const utcDate = new Date(baseDate.getTime() - timezoneOffset * 60000);
                            utcDate.setMilliseconds(0);

                            const isBooked = bookedTimeStamps.includes(utcDate.getTime());

                            return (
                              <div
                                key={index}
                                className={`border rounded-lg p-3 text-center transition-colors ${selectedTime === time
                                  ? "border-primary bg-primary/5"
                                  : isBooked
                                    ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-gray-200 hover:border-primary/50 cursor-pointer"
                                  }`}
                                onClick={() => {
                                  if (!isBooked) setSelectedTime(time);
                                }}
                              >
                                {time}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Select a day to view available time slots.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 text-right">
                    <Button type="submit" disabled={!selectedTime || isSubmitting}>
                      {isSubmitting ? "Booking..." : "Confirm Appointment"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="mt-1 text-primary">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  </div>
);

export default DoctorDetail;
