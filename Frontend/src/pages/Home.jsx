import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Stethoscope, Clock, Building2, Users, ArrowRight } from "lucide-react";
import ServiceCard from "../components/ui/ServiceCard";
import DoctorCard from "../components/ui/DoctorCard";
import { services, faqs } from "../lib/data";
import FAQItem from "../components/ui/FAQItem";
import axios from "axios";

const Home = () => {
  // State for doctors
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState("");

  // Get featured services (first 3)
  const featuredServices = services.slice(0, 3);

  // Get featured FAQs (first 3)
  const featuredFaqs = faqs.slice(0, 3);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await axios.get("http://localhost:8090/api/doctors");
        setDoctors(response.data.slice(0, 4)); // Get first 4 doctors
      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Health Is Our Priority
              </h1>
              <p className="text-xl mb-8">
                MediSys Hospital provides world-class healthcare with compassion
                and excellence. Our team of experienced professionals is
                dedicated to your well-being.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/doctors">
                  <Button size="lg" className="font-semibold">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 font-semibold"
                  >
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src="https://live-production.wcms.abc-cdn.net.au/1726b9e85e2df0b6de84b1338fea6b2b?impolicy=wcms_crop_resize&cropH=1688&cropW=3000&xPos=0&yPos=0&width=862&height=485"
                alt="Healthcare Illustration"
                className="w-full max-w-md md:max-w-lg rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MediSys Hospital
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology, experienced specialists, and
              patient-centered care to deliver exceptional healthcare services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Doctors
              </h3>
              <p className="text-gray-600">
                Our team consists of highly qualified and experienced medical
                professionals.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Service
              </h3>
              <p className="text-gray-600">
                Round-the-clock emergency services and care whenever you need
                it.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Modern Facilities
              </h3>
              <p className="text-gray-600">
                State-of-the-art equipment and technology for accurate diagnosis
                and treatment.
              </p>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg text-center">
              <div className="bg-amber-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Patient-Centered
              </h3>
              <p className="text-gray-600">
                Personalized care focusing on patient comfort, dignity, and
                well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Medical Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive healthcare services to meet all your
              medical needs under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
                link={`/services#${service.id}`}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" className="gap-2">
                View All Services <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Doctors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our team of experienced and dedicated doctors provide exceptional
              care across all medical specialties.
            </p>
          </div>

          {loadingDoctors ? (
            <p className="text-center text-gray-600">Loading doctors...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.fullName}
                  specialization={doctor.specialization}
                  ahpraNumber={doctor.registrationNumber}
                  experience={doctor.yearsOfExperience}
                  imageUrl={doctor.imageUrl}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/doctors">
              <Button variant="outline" className="gap-2">
                View All Doctors <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to commonly asked questions about our services and
              facilities.
            </p>
          </div>

          <div className="space-y-2">
            {featuredFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/faqs">
              <Button variant="outline" className="gap-2">
                View All FAQs <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Schedule an appointment today and experience the highest quality
            healthcare for you and your family.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/doctors">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Book Appointment
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className=" border-white text-primary hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
