import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Login failed");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
