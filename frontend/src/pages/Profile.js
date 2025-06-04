import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState(null);
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoverStates, setHoverStates] = useState({});

  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [token, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: user } = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(user);

      if (user.isAdmin && user.productsAdded?.length > 0) {
        const productResponses = await Promise.all(
          user.productsAdded.map((id) =>
            axios
              .get(`http://localhost:5000/api/products/${id}`)
              .then((res) => res.data)
              .catch(() => null)
          )
        );
        const validProducts = productResponses.filter((p) => p !== null);
        setAdminProducts(validProducts);
      } else {
        setAdminProducts([]);
      }
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProductClick = (id) => navigate(`/product/${id}`);
  const handleAddProduct = () => navigate("/AdminProductForm");
  const handleUpdateProduct = (productId, e) => {
    e.stopPropagation();
    navigate(`/update-product/${productId}`);
  };

  const handleDeleteProduct = async (productId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdminProducts((prev) => prev.filter((p) => p._id !== productId));
        setUserInfo((prev) => ({
          ...prev,
          productsAdded: prev.productsAdded.filter((id) => id !== productId),
        }));

        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.response?.data?.message || "Failed to delete product");
        fetchUserData(); // Refresh if error
      }
    }
  };

  const handleMouseEnter = (productId) =>
    setHoverStates((prev) => ({ ...prev, [productId]: true }));
  const handleMouseLeave = (productId) =>
    setHoverStates((prev) => ({ ...prev, [productId]: false }));

  return (
    <div style={styles.container}>
      <button className="go-back-button" onClick={() => window.history.back()}>
        ← Go Back
      </button>
      <h2 style={styles.header}>👤 Profile Dashboard</h2>
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : userInfo ? (
        <div style={styles.profileContainer}>
          <div style={styles.userInfoSection}>
            <div style={styles.avatar}>
              {userInfo.name[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 style={styles.username}>{userInfo.name}</h3>
              <p style={styles.infoText}>📧 {userInfo.email}</p>
              <p style={styles.infoText}>
                🗓️ Joined: {new Date(userInfo.createdAt).toLocaleDateString()}
              </p>
              <p style={styles.infoText}>
                🔐 Role:{" "}
                <strong>{userInfo.isAdmin ? "Administrator" : "User"}</strong>
              </p>
            </div>
          </div>

          {userInfo.isAdmin && (
            <div style={styles.adminSection}>
              <div style={styles.adminHeader}>
                <h3 style={styles.sectionTitle}>Your Added Products</h3>
                <button onClick={handleAddProduct} style={styles.addProductBtn}>
                  ➕ Add Product
                </button>
              </div>
              {adminProducts.length > 0 ? (
                <div style={styles.productsList}>
                  {adminProducts.map((product) => (
                    <div
                      key={product._id}
                      style={{
                        ...styles.productItem,
                        ...(hoverStates[product._id]
                          ? styles.productItemHover
                          : {}),
                      }}
                      onClick={() => handleProductClick(product._id)}
                      onMouseEnter={() => handleMouseEnter(product._id)}
                      onMouseLeave={() => handleMouseLeave(product._id)}
                    >
                      <img
                        src={product.image || "/default-product.png"}
                        alt={product.name}
                        style={styles.productImage}
                      />
                      <div style={styles.productDetails}>
                        <strong style={styles.productTitle}>
                          {product.name}
                        </strong>
                        <p style={styles.productPrice}>
                          ₹{product.price.toFixed(2)}
                        </p>
                        <p style={styles.productCategory}>{product.category}</p>
                      </div>
                      <div style={styles.productActions}>
                        <button
                          style={styles.updateButton}
                          onClick={(e) => handleUpdateProduct(product._id, e)}
                        >
                          ✏️
                        </button>
                        <button
                          style={styles.deleteButton}
                          onClick={(e) => handleDeleteProduct(product._id, e)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.noProductsText}>No products added yet.</p>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#c82333")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#dc3545")
            }
          >
            🚪 Logout
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
    maxWidth: "950px",
    margin: "auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    color: "#1a202c",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: 700,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
  errorText: {
    color: "#dc3545",
    backgroundColor: "#f8d7da",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #f5c6cb",
    textAlign: "center",
  },
  profileContainer: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 0 12px rgba(0,0,0,0.06)",
  },
  userInfoSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: "1.6rem",
    fontWeight: 700,
    marginBottom: "0.3rem",
  },
  infoText: { fontSize: "1rem", color: "#333", marginBottom: "0.2rem" },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "0.7rem 1.2rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "2rem",
  },
  adminSection: { marginTop: "2rem" },
  adminHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addProductBtn: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  sectionTitle: { fontSize: "1.3rem", fontWeight: 600, color: "#2c3e50" },
  noProductsText: { fontStyle: "italic", color: "#888" },
  productsList: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  productItem: {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#fdfdfd",
    borderRadius: "10px",
    border: "1px solid #e2e6ea",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  productItemHover: {
    transform: "scale(1.01)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  productImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  productDetails: { flexGrow: 1, marginLeft: "1rem" },
  productTitle: { fontSize: "1.1rem", fontWeight: 600 },
  productPrice: { color: "#28a745", fontWeight: "bold" },
  productCategory: { fontStyle: "italic", color: "#6c757d" },
  productActions: { display: "flex", gap: "0.5rem" },
  updateButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

export default Profile;
