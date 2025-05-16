import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "../components/ui/button";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're here to help! Reach out to us with any questions, concerns, or
            to schedule an appointment.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Our Location
            </h3>
            <p className="text-gray-600">
              123 Healthcare St
              <br />
              Sydney, NSW 2000
              <br />
              Australia
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Phone Numbers
            </h3>
            <p className="text-gray-600">
              Main:{" "}
              <a
                href="tel:+61234567890"
                className="text-primary hover:underline"
              >
                +61 2 3456 7890
              </a>
              <br />
              Emergency:{" "}
              <a
                href="tel:+61234567899"
                className="text-primary hover:underline"
              >
                +61 2 3456 7899
              </a>
              <br />
              Appointments:{" "}
              <a
                href="tel:+61234567891"
                className="text-primary hover:underline"
              >
                +61 2 3456 7891
              </a>
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Email Addresses
            </h3>
            <p className="text-gray-600">
              General:{" "}
              <a
                href="mailto:info@medisys.com.au"
                className="text-primary hover:underline"
              >
                info@medisys.com.au
              </a>
              <br />
              Appointments:{" "}
              <a
                href="mailto:appointments@medisys.com.au"
                className="text-primary hover:underline"
              >
                appointments@medisys.com.au
              </a>
              <br />
              Support:{" "}
              <a
                href="mailto:support@medisys.com.au"
                className="text-primary hover:underline"
              >
                support@medisys.com.au
              </a>
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Working Hours
            </h3>
            <p className="text-gray-600">
              Monday - Friday:
              <br />
              8:00 AM - 8:00 PM
              <br />
              Saturday - Sunday:
              <br />
              9:00 AM - 5:00 PM
            </p>
          </div>
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Thank you for your message! We'll get back to you as soon as
                possible.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>

            <div className="h-96 bg-gray-200 rounded-lg mb-6 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-sm">
                  123 Healthcare St, Sydney, NSW 2000, Australia
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Directions
              </h3>
              <p className="text-gray-600 mb-4">
                MediSys Hospital is conveniently located in downtown Sydney,
                easily accessible by public transportation and private vehicles.
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-medium">
                        1
                      </span>
                    </div>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    <span className="font-medium">By Train:</span> Alight at
                    Central Station and take a 5-minute walk north on Elizabeth
                    Street.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-medium">
                        2
                      </span>
                    </div>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    <span className="font-medium">By Bus:</span> Bus routes 301,
                    302, and 303 stop directly in front of the hospital.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-medium">
                        3
                      </span>
                    </div>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">
                    <span className="font-medium">By Car:</span> Underground
                    parking is available at a rate of $5 per hour, with
                    validation for patients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
