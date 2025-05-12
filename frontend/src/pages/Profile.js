import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User info response:", response.data);
        setUserInfo(response.data);
      } catch (err) {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message
        );
        setError(
          err.response?.data?.message || "Failed to fetch user information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : userInfo ? (
        <div style={styles.profileContainer}>
          <h3 style={styles.username}>{userInfo.name}</h3>
          <p style={styles.infoText}>Email: {userInfo.email}</p>
          <p style={styles.infoText}>
            Joined: {new Date(userInfo.createdAt).toLocaleDateString()}
          </p>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  profileContainer: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "1rem",
  },
  username: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#333",
  },
  infoText: {
    fontSize: "1.1rem",
    color: "#555",
    margin: "0.5rem 0",
  },
  logoutBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
    fontSize: "1.1rem",
    transition: "background-color 0.3s",
  },
  errorText: {
    color: "#dc3545",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

export default Profile;
