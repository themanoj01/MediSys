import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import DoctorCard from '../components/ui/DoctorCard';
import { doctors } from '../lib/data';
import { Button } from '../components/ui/button';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  // Get unique specializations for filter
  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];
  
  // Filter doctors based on search term and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === '' || doctor.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Doctors</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet our team of experienced and dedicated healthcare professionals who are committed to providing you with the highest quality care.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or specialization"
                className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary appearance-none bg-white"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedSpecialization && (
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Filtered by:</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                {selectedSpecialization}
                <button
                  onClick={() => setSelectedSpecialization('')}
                  className="ml-2 text-primary hover:text-primary/70"
                >
                  ✕
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Doctor Cards */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                specialization={doctor.specialization}
                ahpraNumber={doctor.ahpraNumber}
                experience={doctor.experience}
                imageUrl={doctor.imageUrl}
                description={doctor.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6">
              No doctors match your search criteria. Please try a different search term or filter.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;