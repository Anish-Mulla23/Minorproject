// src/services/cartService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const cartService = {
  async addToCart(productId) {
    try {
      const response = await axios.post(
        `${API_URL}/add`,
        { productId },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add to cart";
    }
  },

  async removeFromCart(productId) {
    try {
      const response = await axios.post(
        `${API_URL}/remove`,
        { productId },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to remove from cart";
    }
  },

  async updateCartItem(productId, quantity) {
    try {
      const response = await axios.post(
        `${API_URL}/update`,
        { productId, quantity },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update cart item";
    }
  },

  async getCart() {
    try {
      const response = await axios.get(API_URL, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to get cart";
    }
  },
};
