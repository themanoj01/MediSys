import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Patients = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPatient({ ...editPatient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8090/api/patients", form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Patient added successfully!");
      fetchPatients();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:8090/api/patients/${editPatient.id}`,
        editPatient,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Patient updated successfully!");
      fetchPatients();
      setEditPatient(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditPatient({
      id: patient.id,
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split("T")[0] : "",
      address: patient.address || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.delete(`http://localhost:8090/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Patient deleted successfully!");
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete patient");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: "",
      address: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Patients
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

        {/* Add Patient Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Patient
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
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
                {loading ? "Adding..." : "Add Patient"}
              </button>
            </div>
          </form>
        </div>

        {/* Patients Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Registered Patients
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
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.dateOfBirth
                          ? new Date(patient.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.address || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(patient)}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
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

        {/* Edit Modal */}
        {editPatient && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Edit Patient
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editPatient.fullName}
                    onChange={handleEditInputChange}
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
                    value={editPatient.email}
                    onChange={handleEditInputChange}
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
                    value={editPatient.phone}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editPatient.gender}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editPatient.dateOfBirth}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editPatient.address}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 p-3 rounded-lg text-white font-semibold ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } transition`}
                  >
                    {loading ? "Updating..." : "Update Patient"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPatient(null)}
                    className="flex-1 p-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
