import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext";
import { CartProvider } from "./context/CartContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./Dashboard";
import ProductDetail from "./components/product/ProductDetail";
import Wishlist from "./Wishlist";
import Profile from "./pages/Profile";
import AdminProductForm from "./components/admin/AdminProductForm";
import CartPage from "./pages/CartPage";
import BuyNowPage from "./pages/BuyNowPage"; // adjust path as needed

import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/AdminProductForm" element={<AdminProductForm />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/buy-now" element={<BuyNowPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
