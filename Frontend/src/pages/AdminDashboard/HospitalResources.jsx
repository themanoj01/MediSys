import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Resources = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourceBookings, setResourceBookings] = useState([]);
  const [editResource, setEditResource] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchResources();
    fetchResourceBookings();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/resources", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setResources(response.data);
    } catch (err) {
      setError("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8090/api/resource-bookings",
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setResourceBookings(response.data);
    } catch (err) {
      setError("Failed to fetch resource bookings");
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
    setEditResource({ ...editResource, [name]: value });
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
      "resource",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:8090/api/resources", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setSuccess("Resource added successfully!");
      fetchResources();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add resource");
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
      "resource",
      new Blob(
        [
          JSON.stringify({
            name: editResource.name,
            description: editResource.description,
            quantity: editResource.quantity,
            price: editResource.price,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      await axios.put(
        `http://localhost:8090/api/resources/${editResource.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setSuccess("Resource updated successfully!");
      fetchResources();
      setEditResource(null);
      setEditImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditResource({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      quantity: resource.quantity.toString(),
      price: resource.price.toString(),
    });
    setEditImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.delete(`http://localhost:8090/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setSuccess("Resource deleted successfully!");
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete resource");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      quantity: "",
      price: "",
    });
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Resources
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

        {/* Add Resource Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Resource
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Image
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
                {loading ? "Adding..." : "Add Resource"}
              </button>
            </div>
          </form>
        </div>

        {/* Resources Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resources
          </h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : resources.length > 0 ? (
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
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resources.map((resource, index) => (
                    <tr
                      key={resource.id}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.image ? (
                          <img
                            src={`http://localhost:8090${resource.image}`}
                            alt={resource.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {resource.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {resource.description || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {resource.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${resource.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(resource)}
                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
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
          ) : (
            <p className="text-gray-600 text-center py-4">
              No resources found.
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resource Bookings
          </h2>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : resourceBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resourceBookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.resource.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {booking.user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.startDateTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.endDateTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {booking.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No bookings found.</p>
          )}
        </div>

        {/* Edit Modal */}
        {editResource && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Edit Resource
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editResource.name}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={editResource.description}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={editResource.quantity}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editResource.price}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
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
                    {loading ? "Updating..." : "Update Resource"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditResource(null)}
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

export default Resources;
