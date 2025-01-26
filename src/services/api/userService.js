import api from "../../utils/api";

const userService = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  resetPassword: async (userId, newPassword) => {
    const response = await api.post(`/users/${userId}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  updateEmail: async (userId, newEmail) => {
    const response = await api.put(`/users/${userId}/email`, {
      newEmail,
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;
