import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Save, Edit, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    id: "", // Add id to the profile state
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    medicareNumber: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("Please log in to view your profile.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8090/api/patients/me",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setProfile(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userRole");
          window.dispatchEvent(new Event("authChange"));
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load profile.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Please log in to update your profile.");
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:8090/api/patients/${profile.id}`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userRole");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const renderField = (label, value) => (
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-gray-900">{value || "Not set"}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end mb-4">
            <Button
              onClick={toggleEdit}
              className="flex items-center bg-primary hover:bg-primary/90 text-white"
              disabled={isSubmitting}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </>
              )}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                ["Full Name", "fullName", "text"],
                ["Email", "email", "email", true],
                ["Phone Number", "phone", "tel"],
                ["Date of Birth", "dateOfBirth", "date"],
                ["Gender", "gender", "text"],
                ["Address", "address", "textarea"],
                ["Medicare Number", "medicareNumber", "text"],
                ["Emergency Contact", "emergencyContact", "text"],
                ["Medical History", "medicalHistory", "textarea"],
              ].map(([label, name, type, disabled]) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      id={name}
                      name={name}
                      rows="3"
                      className="w-full border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      value={profile[name]}
                      onChange={handleChange}
                      disabled={disabled}
                    />
                  ) : (
                    <input
                      type={type}
                      id={name}
                      name={name}
                      className={`w-full border-gray-300 rounded-md ${
                        disabled
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "focus:ring-primary focus:border-primary"
                      }`}
                      value={profile[name]}
                      onChange={handleChange}
                      disabled={disabled}
                    />
                  )}
                </div>
              ))}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {renderField("Full Name", profile.fullName)}
              {renderField("Email", profile.email)}
              {renderField("Phone Number", profile.phone)}
              {renderField("Date of Birth", profile.dateOfBirth)}
              {renderField("Gender", profile.gender)}
              {renderField("Address", profile.address)}
              {renderField("Medicare Number", profile.medicareNumber)}
              {renderField("Emergency Contact", profile.emergencyContact)}
              {renderField("Medical History", profile.medicalHistory)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
