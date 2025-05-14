import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Clipboard,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    gender: "",
    address: "",
    medicareNumber: "",
    emergencyContact: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.medicareNumber.trim())
      newErrors.medicareNumber = "Medicare number is required";
    if (!formData.emergencyContact.trim())
      newErrors.emergencyContact = "Emergency contact is required";
    if (!formData.password) newErrors.password = "Password is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }

    const medicareRegex = /^\d{10,11}$/;
    if (
      formData.medicareNumber &&
      !medicareRegex.test(formData.medicareNumber)
    ) {
      newErrors.medicareNumber = "Medicare number must be 10 or 11 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        medicareNumber: formData.medicareNumber,
        emergencyContact: formData.emergencyContact,
      };

      const response = await axios.post(
        "http://localhost:8090/api/auth/register-patient",
        payload
      );

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <Card className="p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Registration Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Your account has been created successfully. Please proceed to
                Login.
              </p>
              <div className="mt-6">
                <Link to="/login">
                  <Button className="w-full">Proceed to Login</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create an Account
            </h1>
            <p className="mt-2 text-gray-600">
              Join MediSys Hospital for easy appointment booking and more
            </p>
          </div>

          {apiError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={errors.fullName ? "true" : "false"}
                    aria-describedby={errors.fullName ? "fullName-error" : ""}
                  />
                </div>
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-600">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : ""}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : ""}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.dateOfBirth ? "border-red-500" : ""
                    }`}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    aria-invalid={errors.dateOfBirth ? "true" : "false"}
                    aria-describedby={
                      errors.dateOfBirth ? "dateOfBirth-error" : ""
                    }
                  />
                </div>
                {errors.dateOfBirth && (
                  <p
                    id="dateOfBirth-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                  value={formData.gender}
                  onChange={handleChange}
                  aria-invalid={errors.gender ? "true" : "false"}
                  aria-describedby={errors.gender ? "gender-error" : ""}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p id="gender-error" className="mt-1 text-sm text-red-600">
                    {errors.gender}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    value={formData.address}
                    onChange={handleChange}
                    aria-invalid={errors.address ? "true" : "false"}
                    aria-describedby={errors.address ? "address-error" : ""}
                  />
                </div>
                {errors.address && (
                  <p id="address-error" className="mt-1 text-sm text-red-600">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="medicareNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Medicare Number *
                </label>
                <div className="relative">
                  <Clipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="medicareNumber"
                    name="medicareNumber"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.medicareNumber ? "border-red-500" : ""
                    }`}
                    value={formData.medicareNumber}
                    onChange={handleChange}
                    aria-invalid={errors.medicareNumber ? "true" : "false"}
                    aria-describedby={
                      errors.medicareNumber ? "medicareNumber-error" : ""
                    }
                  />
                </div>
                {errors.medicareNumber && (
                  <p
                    id="medicareNumber-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.medicareNumber}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="emergencyContact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Emergency Contact *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.emergencyContact ? "border-red-500" : ""
                    }`}
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    aria-invalid={errors.emergencyContact ? "true" : "false"}
                    aria-describedby={
                      errors.emergencyContact ? "emergencyContact-error" : ""
                    }
                  />
                </div>
                {errors.emergencyContact && (
                  <p
                    id="emergencyContact-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.emergencyContact}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`pl-10 w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={
                      errors.confirmPassword ? "confirmPassword-error" : ""
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                    errors.agreeTerms ? "border-red-500" : ""
                  }`}
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  aria-invalid={errors.agreeTerms ? "true" : "false"}
                  aria-describedby={errors.agreeTerms ? "agreeTerms-error" : ""}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
                {errors.agreeTerms && (
                  <p
                    id="agreeTerms-error"
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
