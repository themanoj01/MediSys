import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRoute } from "wouter";
import {
  Calendar,
  Clock,
  Award,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { doctors } from "../lib/data";

const DoctorDetail = () => {
  const [match, params] = useRoute("/doctors/:id");
  const [doctor, setDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (params && params.id) {
      const foundDoctor = doctors.find((doc) => doc.id === params.id);
      setDoctor(foundDoctor || null);

      if (
        foundDoctor &&
        foundDoctor.availability &&
        foundDoctor.availability.length > 0
      ) {
        setSelectedDay(foundDoctor.availability[0].day);
      }
    }
  }, [params]);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Doctor Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The doctor you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/doctors">
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 1500);
  };

  const getAvailableTimesForSelectedDay = () => {
    const dayInfo = doctor.availability.find(
      (avail) => avail.day === selectedDay
    );
    return dayInfo ? dayInfo.slots : [];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/doctors">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Doctors
            </Button>
          </Link>
        </div>

        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Doctor Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="h-full">
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Doctor Details */}
            <div className="p-6 md:p-8 md:w-2/3 lg:w-3/4">
              <div className="flex flex-wrap items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {doctor.name}
                  </h1>
                  <p className="text-primary font-medium">
                    {doctor.specialization}
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full mt-2 md:mt-0">
                  <span className="text-sm font-medium">
                    {doctor.experience} Years Experience
                  </span>
                </div>
              </div>

              <div className="flex items-center mt-6">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">
                  AHPRA Registration: {doctor.ahpraNumber}
                </span>
              </div>

              <p className="mt-6 text-gray-700 leading-relaxed">
                {doctor.description}
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Consultations</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      In-person & Video
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Contact</h3>
                    <p className="text-sm text-gray-600 mt-1">(02) 5555-1234</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      MediSys Hospital, Level 3
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="border-t border-gray-200">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book an Appointment
              </h2>

              {bookingSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Appointment Requested
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your appointment request with {doctor.name} for{" "}
                    {selectedDay} at {selectedTime} has been submitted
                    successfully. You will receive a confirmation email shortly.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      onClick={() => setBookingSuccess(false)}
                      variant="outline"
                    >
                      Book Another
                    </Button>
                    <Link href="/my-bookings">
                      <Button>View My Bookings</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Available Days */}
                    <div>
                      <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                        <Calendar className="h-5 w-5 text-primary mr-2" />
                        Available Days
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {doctor.availability.map((avail, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedDay === avail.day
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                            onClick={() => {
                              setSelectedDay(avail.day);
                              setSelectedTime("");
                            }}
                          >
                            <div className="font-medium">{avail.day}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {avail.slots.length} time slots
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Available Times */}
                    <div>
                      <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
                        <Clock className="h-5 w-5 text-primary mr-2" />
                        Available Times
                      </h3>

                      {selectedDay ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {getAvailableTimesForSelectedDay().map(
                            (time, index) => (
                              <div
                                key={index}
                                className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${
                                  selectedTime === time
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                                onClick={() => setSelectedTime(time)}
                              >
                                <div className="font-medium">{time}</div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500">
                            Please select a day first
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!selectedDay || !selectedTime || isSubmitting}
                      className="min-w-[150px]"
                    >
                      {isSubmitting ? "Booking..." : "Book Appointment"}
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

export default DoctorDetail;
