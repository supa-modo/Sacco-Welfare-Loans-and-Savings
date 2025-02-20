import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser, FaEnvelope, FaKey, FaBuilding } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import NotificationModal from "./NotificationModal";

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    department: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setNotificationType("success");
      setNotificationMessage("User added successfully!");
      setNotificationOpen(true);
      onUserAdded(response.data); // Notify parent component to update the user list
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "member",
        department: "",
        password: "",
      });
    } catch (error) {
      setNotificationType("error");
      setNotificationMessage(
        error.response?.data?.message || "Failed to add user. Please try again."
      );
      setNotificationOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-4 bg-gradient-to-r from-primary-100 to-primary-50 shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl  font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                  Add New User
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details to create a new user
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
              >
                <IoClose className="w-6 h-6 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-8 grid grid-cols-2 gap-4 ">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  First Name
                </label>
                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Last Name
                </label>
                <div className="relative group">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Email
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Role
                </label>
                <div className="relative group">
                  <RiAdminLine className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                  </select>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Department
                </label>
                <div className="relative group">
                  <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-12 py-2.5 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  "Add User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => {
          setIsSubmitting(false);
          onClose();
        }}
        type={notificationType}
        title={notificationType === "success" ? "Success" : "Error"}
        message={notificationMessage}
      />
    </>
  );
};

export default AddUserModal;
