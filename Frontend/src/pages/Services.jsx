import React from "react";
import ServiceCard from "../components/ui/ServiceCard";
import { services } from "../lib/data";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Phone } from "lucide-react";

const Services = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Our Medical Services</h1>
            <p className="text-xl opacity-90 mb-8">
              MediSys Hospital offers a comprehensive range of medical services
              delivered by experienced specialists using state-of-the-art
              technology.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/appointment">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Book an Appointment
                </Button>
              </Link>
              <a href="tel:+61234567890">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-violet-950 hover:bg-white/10 inline-flex items-center gap-2"
                >
                  <Phone size={18} />
                  Call Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} id={service.id}>
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our Services Work
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've simplified the process to ensure you receive the care you
              need efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                Book an Appointment
              </h3>
              <p className="text-gray-600">
                Schedule an appointment through our online system, by phone, or
                in person at our reception desk.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                Consultation
              </h3>
              <p className="text-gray-600">
                Meet with one of our specialists who will assess your condition
                and recommend appropriate treatments.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                Treatment & Follow-up
              </h3>
              <p className="text-gray-600">
                Receive personalized care and treatment with regular follow-up
                appointments to monitor your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-8 md:mb-0 md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Need a Specialized Service?
                </h2>
                <p className="text-lg text-gray-600">
                  Our team of medical professionals is ready to provide you with
                  the specialized care you need. Contact us today to learn more
                  about our services.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:w-1/3 md:flex-col md:items-end">
                <Link to="/appointment">
                  <Button size="lg" className="w-full sm:w-auto md:w-full">
                    Book an Appointment
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto md:w-full"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
