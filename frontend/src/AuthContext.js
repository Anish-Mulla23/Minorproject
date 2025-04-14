import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async ({ name, email, password }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
      });
      console.log("User registered:", res.data);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      console.log(name, email, password);
    }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        userData
      );
      setUser(response.data.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
