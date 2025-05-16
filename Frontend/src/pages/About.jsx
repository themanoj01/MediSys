import React from "react";
import {
  Heart,
  Microscope,
  ShieldCheck,
  Users,
  Award,
  LineChart,
  Building2,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const About = () => {
  const stats = {
    founded: 1985,
    doctors: 51,
    patients: 10000,
    beds: 210,
    departments: 12,
    satisfaction: 98,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">About MediSys Hospital</h1>
            <p className="text-xl opacity-90 mb-4">
              Leading the way in medical excellence since {stats.founded}.
            </p>
            <p className="text-lg opacity-80">
              We're dedicated to providing exceptional healthcare with
              compassion, innovation, and a patient-centered approach.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-start md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                To enhance the health and wellbeing of the communities we serve
                through compassionate care, clinical excellence, and innovation.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to delivering personalized, high-quality
                healthcare services that improve the health outcomes and quality
                of life for all our patients.
              </p>
            </div>

            <div className="md:w-1/2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Microscope className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                To be the leading healthcare provider, renowned for excellence
                in patient care, medical education, research, and community
                engagement.
              </p>
              <p className="text-lg text-gray-600">
                We strive to set the standard for healthcare delivery by
                combining cutting-edge technology with compassionate,
                patient-centered care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              MediSys By The Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              For over {new Date().getFullYear() - stats.founded} years, we've
              been committed to providing exceptional healthcare to our
              community.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.founded}
              </p>
              <p className="text-sm text-gray-600">Year Founded</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.doctors}
              </p>
              <p className="text-sm text-gray-600">Specialists</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.patients.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Patients Served</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.departments}
              </p>
              <p className="text-sm text-gray-600">Departments</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.beds}</p>
              <p className="text-sm text-gray-600">Hospital Beds</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.satisfaction}%
              </p>
              <p className="text-sm text-gray-600">Patient Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from patient care to
              community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Compassion
              </h3>
              <p className="text-gray-600">
                We treat every patient with kindness, empathy, and respect,
                recognizing their individual needs and concerns.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600">
                We strive for the highest standards in healthcare delivery,
                constantly improving our services and outcomes.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integrity
              </h3>
              <p className="text-gray-600">
                We act with honesty, transparency, and accountability in all our
                interactions and decisions.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-4">
                <Microscope className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We embrace new ideas, technologies, and approaches to advance
                healthcare and improve patient outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From our founding to the present day, we've been dedicated to
              advancing healthcare and serving our community.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

            <div className="space-y-16">
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-7 h-7 rounded-full border-4 border-primary bg-white"></div>
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-8 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900">
                      {stats.founded}
                    </h3>
                    <p className="text-lg text-gray-600">
                      Founding of MediSys Hospital
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-8">
                    <p className="text-gray-600">
                      MediSys Hospital was established with a mission to provide
                      high-quality healthcare to the community of Sydney.
                      Starting with just 50 beds and a small team of dedicated
                      professionals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-7 h-7 rounded-full border-4 border-primary bg-white"></div>
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-8 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900">1995</h3>
                    <p className="text-lg text-gray-600">
                      Expansion and Growth
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-8">
                    <p className="text-gray-600">
                      The hospital underwent a major expansion, adding new
                      wings, increasing bed capacity to 150, and bringing on
                      specialized departments in cardiology, oncology, and
                      neurology.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-7 h-7 rounded-full border-4 border-primary bg-white"></div>
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-8 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900">2005</h3>
                    <p className="text-lg text-gray-600">
                      Technological Advancement
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-8">
                    <p className="text-gray-600">
                      MediSys embraced cutting-edge technology, implementing
                      electronic health records, advanced imaging systems, and
                      minimally invasive surgical capabilities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-7 h-7 rounded-full border-4 border-primary bg-white"></div>
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-8 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900">2015</h3>
                    <p className="text-lg text-gray-600">
                      Research and Education Center
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-8">
                    <p className="text-gray-600">
                      The MediSys Research and Education Center was established,
                      focusing on medical research, clinical trials, and
                      training the next generation of healthcare professionals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-7 h-7 rounded-full border-4 border-primary bg-white"></div>
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-8 md:text-right mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900">Today</h3>
                    <p className="text-lg text-gray-600">
                      Leading Healthcare Provider
                    </p>
                  </div>
                  <div className="md:w-1/2 pl-8">
                    <p className="text-gray-600">
                      Today, MediSys Hospital stands as a leading healthcare
                      institution in Australia, with {stats.beds} beds,{" "}
                      {stats.doctors} specialists across {stats.departments}{" "}
                      departments, serving over{" "}
                      {stats.patients.toLocaleString()} patients annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Our Healthcare Journey
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience the MediSys difference – where compassionate care meets
            medical excellence.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/doctors">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Book an Appointment
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-900 hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
