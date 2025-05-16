import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter } from "lucide-react";
import DoctorCard from "../components/ui/DoctorCard";
import { Button } from "../components/ui/button";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8090/api/doctors");
        setDoctors(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Doctors
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet our team of experienced healthcare professionals.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or specialization"
                  className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-md bg-white"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedSpecialization && (
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">Filtered by:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {selectedSpecialization}
                  <button
                    onClick={() => setSelectedSpecialization("")}
                    className="ml-2 text-blue-600 hover:text-blue-400"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.fullName}
                  specialization={doctor.specialization}
                  ahpraNumber={doctor.registrationNumber}
                  experience={doctor.yearsOfExperience}
                  imageUrl={doctor.imageUrl || "/default-doctor.jpg"}
                  description={
                    doctor.description ||
                    `Dr. ${doctor.fullName} specializes in ${doctor.specialization}.`
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600 mb-6">
                Try different search terms or filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Doctors;
