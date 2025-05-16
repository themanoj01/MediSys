import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../../components/ui/button";

const Doctors = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    registrationNumber: "",
    yearsOfExperience: "",
    gender: "",
  });
  const [image, setImage] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [editDoctor, setEditDoctor] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Doctors fetched:", response.data);
      setDoctors(response.data);
    } catch (err) {
      setError("Failed to fetch doctors");
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor({ ...editDoctor, [name]: value });
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(
        "http://localhost:8090/api/auth/register-doctor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Doctor added successfully!");
      toast.success("Doctor added successfully!");
      fetchDoctors();
      resetForm();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add doctor";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "doctor",
      new Blob([JSON.stringify(editDoctor)], { type: "application/json" })
    );
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      await axios.put(
        `http://localhost:8090/api/doctors/${editDoctor.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Doctor updated successfully!");
      toast.success("Doctor updated successfully!");
      fetchDoctors();
      setEditDoctor(null);
      setEditImage(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update doctor";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    console.log("Editing doctor:", doctor);
    try {
      if (!doctor?.id) {
        throw new Error("Invalid doctor data: ID missing");
      }
      setEditDoctor({
        id: doctor.id,
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        password: "",
        phone: doctor.phone || "",
        specialization: doctor.specialization || "",
        registrationNumber: doctor.registrationNumber || "",
        yearsOfExperience: doctor.yearsOfExperience?.toString() || "",
        gender: doctor.gender || "",
      });
      setEditImage(null);
      console.log("Edit modal set with:", {
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        registrationNumber: doctor.registrationNumber,
        yearsOfExperience: doctor.yearsOfExperience?.toString(),
        gender: doctor.gender,
      });
    } catch (err) {
      console.error("Error in handleEdit:", err.message);
      setError("Failed to load doctor for editing");
      toast.error("Failed to load doctor for editing");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.delete(`http://localhost:8090/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Doctor deleted successfully!");
      toast.success("Doctor deleted successfully!");
      fetchDoctors();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete doctor";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setDeleteDoctorId(null);
    }
  };

  const openDeleteModal = (id) => {
    console.log("Opening delete modal for doctor ID:", id);
    setDeleteDoctorId(id);
  };

  const closeDeleteModal = () => {
    setDeleteDoctorId(null);
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      registrationNumber: "",
      yearsOfExperience: "",
      gender: "",
    });
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Doctors
        </h1>

        {/* Error/Success Messages */}
        {(error || success) && (
          <div
            className={`p-4 mb-6 rounded-md shadow-sm ${
              error
                ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                : "bg-green-100 border-l-4 border-green-500 text-green-700"
            }`}
            role="alert"
          >
            {error || success}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Doctor
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-3 rounded-lg text-white font-semibold ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } transition`}
              >
                {loading ? "Adding..." : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Registered Doctors
          </h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reg. Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctors.map((doctor, index) => (
                    <tr
                      key={doctor.id}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doctor.imageUrl ? (
                          <img
                            src={`http://localhost:8090${doctor.imageUrl}`}
                            alt={doctor.fullName}
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {doctor.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doctor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doctor.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doctor.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doctor.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doctor.yearsOfExperience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doctor.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              console.log(
                                "Edit button clicked for doctor:",
                                doctor.id
                              );
                              handleEdit(doctor);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(doctor.id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                            title="Delete"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editDoctor && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white rounded-xl shadow-2xl max-w-3xl w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Doctor
                  </h2>
                  <button
                    onClick={() => setEditDoctor(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form
                  onSubmit={handleEditSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={editDoctor.fullName}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editDoctor.email}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editDoctor.phone}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={editDoctor.specialization}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={editDoctor.registrationNumber}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={editDoctor.yearsOfExperience}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editDoctor.gender}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Updating..." : "Update Doctor"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold p-3 rounded-lg"
                      onClick={() => setEditDoctor(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {deleteDoctorId && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Confirm Deletion
                  </h2>
                  <button
                    onClick={closeDeleteModal}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this doctor? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleDelete(deleteDoctorId)}
                    disabled={loading}
                    className={`flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold p-3 rounded-lg ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold p-3 rounded-lg"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
