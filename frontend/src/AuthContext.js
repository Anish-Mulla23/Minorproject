import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async ({ name, email, password }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
      });

      console.log("✅ Registration successful:", res.data);

      const { token, ...userData } = res.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true, token };
    } catch (error) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      console.log("✅ Login successful:", res.data);

      const { token, ...userData } = res.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true, token };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
