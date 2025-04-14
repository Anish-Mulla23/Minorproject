// Wishlist.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/wishlist",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">My Wishlist</h2>
      <div className="product-grid">
        {wishlist.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
