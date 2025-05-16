import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About MediSys</h3>
            <p className="text-gray-400 mb-4">
              MediSys Hospital is a premier healthcare institution in Australia,
              dedicated to providing exceptional medical care with compassion
              and excellence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about">
                  <a className="text-gray-400 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link to="/services">
                  <a className="text-gray-400 hover:text-white">Our Services</a>
                </Link>
              </li>
              <li>
                <Link to="/doctors">
                  <a className="text-gray-400 hover:text-white">Our Doctors</a>
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  <a className="text-gray-400 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link to="/faqs">
                  <a className="text-gray-400 hover:text-white">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Healthcare St, Sydney, NSW 2000, Australia
                </span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <a
                  href="tel:+61234567890"
                  className="text-gray-400 hover:text-white"
                >
                  +61 2 3456 7890
                </a>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <a
                  href="mailto:info@medisys.com.au"
                  className="text-gray-400 hover:text-white"
                >
                  info@medisys.com.au
                </a>
              </li>
              <li className="flex">
                <Clock className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-400">
                  Mon-Fri: 8:00 AM - 8:00 PM
                  <br />
                  Sat-Sun: 9:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter to get the latest health tips and
              hospital news.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="py-6 border-t border-gray-800 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-gray-400">
            &copy; {currentYear} MediSys Hospital. All rights reserved.
          </p>
          <div className="mt-2 sm:mt-0 flex flex-wrap justify-center sm:justify-end space-x-4">
            <Link href="/privacy-policy">
              <a className="text-gray-400 hover:text-white">Privacy Policy</a>
            </Link>
            <Link href="/terms-of-service">
              <a className="text-gray-400 hover:text-white">Terms of Service</a>
            </Link>
            <Link href="/sitemap">
              <a className="text-gray-400 hover:text-white">Sitemap</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
