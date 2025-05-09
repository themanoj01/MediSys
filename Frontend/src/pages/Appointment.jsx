import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { doctors } from "../lib/data";

const Appointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  // Get unique departments from doctors data
  const departments = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ];

  // Filter doctors by selected department
  useEffect(() => {
    if (selectedDepartment) {
      setFilteredDoctors(
        doctors.filter((doctor) => doctor.specialization === selectedDepartment)
      );
      setSelectedDoctor("");
    } else {
      setFilteredDoctors([]);
    }
  }, [selectedDepartment]);

  // Handle doctor selection and update available times
  useEffect(() => {
    if (selectedDoctor) {
      const doctor = doctors.find((doc) => doc.id === selectedDoctor);

      if (doctor && doctor.availability) {
        // For simplicity, just showing the first day's available times
        const dayInfo = doctor.availability[0];
        setAvailableTimes(dayInfo.slots);
      }
    }
  }, [selectedDoctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
    }, 1500);
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep((prev) => prev - 1);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDepartment("");
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTime("");
    setPatientInfo({
      name: "",
      email: "",
      phone: "",
      notes: "",
    });
    setBookingSuccess(false);
  };

  // Selected doctor object
  const doctorObj = doctors.find((doc) => doc.id === selectedDoctor);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book an Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Schedule a visit with one of our healthcare specialists.
          </p>
        </div>

        {/* Booking Success */}
        {bookingSuccess ? (
          <Card className="p-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Appointment Booked Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your appointment has been scheduled. We've sent a confirmation
                email with all the details.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{doctorObj?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{selectedDepartment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{selectedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={resetForm} variant="outline">
                  Book Another Appointment
                </Button>
                <Link href="/my-bookings">
                  <Button>View My Bookings</Button>
                </Link>
              </div>
            </div>
          </Card>
        ) : (
          <div>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="w-full absolute top-1/2 transform -translate-y-1/2">
                  <div className="h-1 bg-gray-200">
                    <div
                      className="h-1 bg-primary transition-all duration-300"
                      style={{ width: `${(step - 1) * 50}%` }}
                    ></div>
                  </div>
                </div>

                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      step >= 1
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    1
                  </div>
                  <p className="text-sm font-medium mt-2">Select Specialist</p>
                </div>

                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      step >= 2
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <p className="text-sm font-medium mt-2">Choose Date & Time</p>
                </div>

                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      step >= 3
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    3
                  </div>
                  <p className="text-sm font-medium mt-2">Your Information</p>
                </div>
              </div>
            </div>

            {/* Step 1: Select Department and Doctor */}
            {step === 1 && (
              <div>
                <Card className="p-6 md:p-8 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Select Medical Department
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {departments.map((department, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDepartment === department
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedDepartment(department)}
                      >
                        <h3 className="font-medium text-gray-900">
                          {department}
                        </h3>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Select Doctor
                  </h2>

                  {selectedDepartment ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedDoctor === doctor.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedDoctor(doctor.id)}
                        >
                          <div className="flex items-center">
                            <img
                              src={doctor.imageUrl}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {doctor.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {doctor.experience} years experience
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Please select a department first
                      </p>
                    </div>
                  )}
                </Card>

                <div className="flex justify-end">
                  <Button onClick={nextStep} disabled={!selectedDoctor}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date and Time */}
            {step === 2 && (
              <div>
                <Card className="p-6 md:p-8 mb-6">
                  <div className="flex items-center mb-6">
                    <img
                      src={doctorObj?.imageUrl}
                      alt={doctorObj?.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {doctorObj?.name}
                      </h2>
                      <p className="text-gray-600">
                        {doctorObj?.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <CalendarIcon className="h-5 w-5 text-primary mr-2" />{" "}
                        Select Date
                      </h3>

                      {/* Simple date picker for demo */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "2023-11-15",
                          "2023-11-16",
                          "2023-11-17",
                          "2023-11-18",
                        ].map((date) => (
                          <div
                            key={date}
                            className={`p-4 border rounded-lg cursor-pointer text-center ${
                              selectedDate === date
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedDate(date)}
                          >
                            <p className="font-medium">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </p>
                            <p className="text-lg font-bold">
                              {new Date(date).getDate()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 text-primary mr-2" /> Select
                        Time
                      </h3>

                      {selectedDate ? (
                        <div className="grid grid-cols-2 gap-4">
                          {availableTimes.map((time, index) => (
                            <div
                              key={index}
                              className={`p-4 border rounded-lg cursor-pointer text-center ${
                                selectedTime === time
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200 hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedTime(time)}
                            >
                              <p className="font-medium">{time}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500">
                            Please select a date first
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Patient Information */}
            {step === 3 && (
              <div>
                <Card className="p-6 md:p-8 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Your Information
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            value={patientInfo.name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            value={patientInfo.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            className="pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            value={patientInfo.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        className="w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Please share any symptoms or concerns you'd like the doctor to know about"
                        value={patientInfo.notes}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Appointment Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Doctor</p>
                          <p className="font-medium">{doctorObj?.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Department</p>
                          <p className="font-medium">{selectedDepartment}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium">{selectedDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="font-medium">{selectedTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          !patientInfo.name ||
                          !patientInfo.email ||
                          !patientInfo.phone
                        }
                      >
                        {isSubmitting ? "Booking..." : "Confirm Booking"}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
