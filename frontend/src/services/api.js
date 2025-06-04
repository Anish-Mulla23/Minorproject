import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/verify-email`, {
    params: { token },
  });
  return response.data;
};

export default {
  register,
  verifyEmail,
};
