import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminProductForm.css";

const ProductDashboard = () => {
  // State management
  const [state, setState] = useState({
    isAdmin: false,
    loading: true,
    submitting: false,
    error: "",
    success: "",
    createdProductId: "",
    productsAdded: [], // To store admin's created products
    formData: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      brand: "",
      image: "",
      featured: false,
      warrantyPeriod: "",
    },
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Books",
    "Toys",
    "Sports",
    "Health & Beauty",
  ];

  // API configuration
  const API_BASE_URL = "http://localhost:5000/api";
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // Helper function to update state
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Verify admin status on component mount
  useEffect(() => {
    const verifyAdminStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        updateState({
          error: "Please login to access this page",
          loading: false,
        });
        window.location.href = "/login";
        return;
      }

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/users/profile`,
          config
        );

        if (data.isAdmin) {
          updateState({
            isAdmin: true,
            loading: false,
            productsAdded: data.productsAdded || [],
          });
        } else {
          handleNonAdminAccess();
        }
      } catch (err) {
        handleAdminVerificationError(err);
      }
    };

    const handleNonAdminAccess = () => {
      const alreadyPrompted = localStorage.getItem("adminPrompted");

      if (!alreadyPrompted) {
        const confirmAccess = window.confirm(
          "You are not an admin. Do you want to request admin access?"
        );

        if (confirmAccess) {
          requestAdminAccess();
        } else {
          redirectToHome();
        }
      } else {
        updateState({
          error: "Admin access already requested. Please wait for approval.",
          loading: false,
        });
      }
    };

    const requestAdminAccess = async () => {
      try {
        await axios.put(`${API_BASE_URL}/users/make-admin`, {}, config);
        localStorage.setItem("adminPrompted", "true");
        updateState({
          success: "Admin access requested. Please wait for approval.",
          loading: false,
          isAdmin: false,
        });
        return () => {
          localStorage.removeItem("adminPrompted");
        };
      } catch (err) {
        updateState({
          error: "Failed to request admin access. Please contact support.",
          loading: false,
        });
      }
    };

    const handleAdminVerificationError = (err) => {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to verify admin status. Please try again later.";
      updateState({ error: errorMessage, loading: false });
      console.error("Admin verification error:", err);
      // window.location.href = "/login";
    };

    const redirectToHome = () => {
      setTimeout(() => (window.location.href = "/"), 1500);
    };

    verifyAdminStatus();

    // Cleanup function
    return () => {
      localStorage.removeItem("adminPrompted");
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;
    if (["price", "stock", "warrantyPeriod"].includes(name)) {
      processedValue = value.replace(/[^0-9.]/g, "");
    }

    updateState({
      formData: {
        ...state.formData,
        [name]: type === "checkbox" ? checked : processedValue,
      },
      error: "", // Clear error when user makes changes
    });
  };

  // Form validation
  const validateForm = () => {
    const { formData } = state;
    const requiredFields = [
      "name",
      "description",
      "price",
      "category",
      "brand",
    ];

    // Check for missing required fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field]?.toString().trim()
    );

    if (missingFields.length > 0) {
      updateState({
        error: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
      });
      return false;
    }

    // Validate price
    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      updateState({ error: "Price must be a positive number" });
      return false;
    }

    // Validate stock if provided
    if (formData.stock && (isNaN(formData.stock) || formData.stock < 0)) {
      updateState({ error: "Stock must be a positive number" });
      return false;
    }

    // Validate warranty period if provided
    if (
      formData.warrantyPeriod &&
      (isNaN(formData.warrantyPeriod) || formData.warrantyPeriod < 0)
    ) {
      updateState({ error: "Warranty period must be a positive number" });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    updateState({
      error: "",
      success: "",
      createdProductId: "",
      submitting: true,
    });

    if (!validateForm()) {
      updateState({ submitting: false });
      return;
    }

    try {
      const payload = {
        name: state.formData.name.trim(),
        description: state.formData.description.trim(),
        price: Number(state.formData.price),
        category: state.formData.category.trim(),
        stock: state.formData.stock ? Number(state.formData.stock) : 0,
        brand: state.formData.brand.trim(),
        image: state.formData.image.trim(),
        featured: state.formData.featured,
        warrantyPeriod: state.formData.warrantyPeriod
          ? Number(state.formData.warrantyPeriod)
          : 0,
      };

      const productResponse = await axios.post(
        `${API_BASE_URL}/products`,
        payload,
        config
      );

      const productId = productResponse.data._id;

      // Then update the admin's productsAdded array with the new product ID
      // const userResponse = await axios.put(
      //   `${API_BASE_URL}/users/add-product`,
      //   { productId },
      //   config
      // );

      updateState({
        success: "Product added successfully!",
        createdProductId: productResponse.data._id,
        formData: {
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          brand: "",
          image: "",
          featured: false,
          warrantyPeriod: "",
        },
        submitting: false,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      updateState({
        error: errorMessage,
        submitting: false,
      });
      console.error("Product creation error:", err.response?.data || err);
    }
  };
  // if (state.loading) return <div className="loading">Loading...</div>;
  // if (!state.isAdmin)
  //   return <div className="unauthorized">Admin access required</div>;

  // Helper function to extract error message
  const getErrorMessage = (error) => {
    if (error.response) {
      return (
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to process your request"
      );
    }
    return "Network error. Please check your connection and try again.";
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  // Main form render
  return (
    <div className="admin-dashboard">
      <div className="product-form-container">
        <button
          className="go-back-button"
          onClick={() => window.history.back()}
        >
          ← Go Back
        </button>
        <h2>Admin Product Dashboard</h2>
        <p className="subtitle">Add new products to your store</p>

        {state.success && (
          <div className="alert success">
            {state.success}
            {state.createdProductId && (
              <div className="product-id">
                Product ID: <code>{state.createdProductId}</code>
              </div>
            )}
          </div>
        )}

        {state.error && <div className="alert error">{state.error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={state.formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Brand */}
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={state.formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={state.formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <div className="input-with-symbol">
                <span className="symbol">₹</span>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={state.formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  pattern="^\d+(\.\d{1,2})?$"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity</label>
              <input
                id="stock"
                name="stock"
                type="text"
                value={state.formData.stock}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
                pattern="^\d+$"
              />
            </div>

            {/* Warranty */}
            <div className="form-group">
              <label htmlFor="warrantyPeriod">Warranty (months)</label>
              <input
                id="warrantyPeriod"
                name="warrantyPeriod"
                type="text"
                value={state.formData.warrantyPeriod}
                onChange={handleChange}
                placeholder="0 for no warranty"
                pattern="^\d+$"
              />
            </div>

            {/* Image URL */}
            <div className="form-group full-width">
              <label htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                type="text"
                value={state.formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
              />
              {state.formData.image && (
                <div className="image-preview">
                  <img
                    src={state.formData.image}
                    alt="Product preview"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={state.formData.description}
                onChange={handleChange}
                placeholder="Enter detailed product description"
                required
                rows={5}
              />
            </div>

            {/* Featured checkbox */}
            <div className="form-group checkbox-group full-width">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={state.formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Mark as featured product</label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={state.submitting}
              className="submit-button"
            >
              {state.submitting ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDashboard;
