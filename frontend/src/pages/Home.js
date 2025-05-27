import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // External CSS file

function Home() {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to <span className="highlight">ShopEasy</span>
      </h1>
      <p className="home-subtitle">Your one-stop shop for everything!</p>
      <button className="dashboard-btn" onClick={handleDashboard}>
        Go to Dashboard
      </button>
    </div>
  );
}

export default Home;
