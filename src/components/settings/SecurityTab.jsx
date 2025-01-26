import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUserPlus,
  FaKey,
  FaEnvelope,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import AddUserModal from "../common/AddNewUser";
import NotificationModal from "../common/NotificationModal";
import userService from "../../services/api/userService";

const SecurityTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotificationConfig({
        type: "error",
        title: "Error",
        message: "Failed to fetch users. Please try again.",
      });
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (userId) => {
    try {
      const newPassword = prompt("Enter new password:");
      if (!newPassword) return;

      await userService.resetPassword(userId, newPassword);
      setNotificationConfig({
        type: "success",
        title: "Success",
        message: "Password has been reset successfully.",
      });
      setShowNotification(true);
    } catch (error) {
      setNotificationConfig({
        type: "error",
        title: "Error",
        message: "Failed to reset password. Please try again.",
      });
      setShowNotification(true);
    }
  };

  const handleEmailUpdate = async (userId) => {
    try {
      const newEmail = prompt("Enter new email:");
      if (!newEmail) return;

      await userService.updateEmail(userId, newEmail);
      await fetchUsers(); // Refresh user list
      setNotificationConfig({
        type: "success",
        title: "Success",
        message: "Email has been updated successfully.",
      });
      setShowNotification(true);
    } catch (error) {
      setNotificationConfig({
        type: "error",
        title: "Error",
        message: "Failed to update email. Please try again.",
      });
      setShowNotification(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    setNotificationConfig({
      type: "confirm",
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete this user? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await userService.deleteUser(userId);
          await fetchUsers(); // Refresh user list
          setNotificationConfig({
            type: "success",
            title: "Success",
            message: "User has been deleted successfully.",
          });
          setShowNotification(true);
        } catch (error) {
          setNotificationConfig({
            type: "error",
            title: "Error",
            message: "Failed to delete user. Please try again.",
          });
          setShowNotification(true);
        }
      },
    });
    setShowNotification(true);
  };

  const handleUserAdded = async () => {
    await fetchUsers();
    setIsAddUserModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.userEmail
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-nunito-sans font-extrabold text-primary-600 mb-4">
        System Users
      </h3>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex w-2/3 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="w-1/3 flex items-center gap-4 font-nunito-sans font-semibold">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-5 py-2 w-full border rounded-lg focus:ring-1 focus:outline-none focus:ring-primary-700 focus:border-primary-700"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddUserModalOpen(true)}
            className="w-full flex justify-center items-center gap-2 px-5 py-2 border border-primary-700 bg-primary-700 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <FaUserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </motion.button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 font-nunito-sans">
            <tr>
              <th className="px-4 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                <FaUser className="w-5 h-5" />
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                Member ID
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y font-nunito-sans divide-gray-200">
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span>{index + 1}.</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                          {user.userEmail[0].toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-[15px] font-bold text-gray-700">
                        {user.userEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.memberId || "No Member ID"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-5 pb-1.5 pt-1 inline-flex text-[13px] leading-5 font-semibold rounded-lg ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "member"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.memberId || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium">
                  <div className="flex space-x-6">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePasswordReset(user.id)}
                      className="text-primary-600 flex items-center gap-2 bg-primary-100 px-4 py-1.5 rounded-lg border border-primary-600 hover:text-primary-900"
                      title="Reset Password"
                    >
                      <FaKey className="w-4 h-4" />
                      <span>Reset Password</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEmailUpdate(user.id)}
                      className="text-blue-600 flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-lg border border-blue-600 hover:text-blue-900"
                      title="Edit Email"
                    >
                      <FaEnvelope className="w-4 h-4" />
                      <span>Edit Email</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 flex items-center gap-2 bg-red-100 px-4 py-1.5 rounded-lg border border-red-600 hover:text-red-900"
                      title="Delete User"
                    >
                      <FaTrash className="w-4 h-4" />
                      <span>Delete User</span>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        onConfirm={notificationConfig.onConfirm}
        type={notificationConfig.type}
        title={notificationConfig.title}
        message={notificationConfig.message}
      />
    </div>
  );
};

export default SecurityTab;
