const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes"); // Import authentication routes
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config(); // Load .env before using it

connectDB(); // ✅ Use this single connection only

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Authentication Routes
app.use("/api/auth", authRoutes); // Add the authentication routes

// Other Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Wishlist and Cart Routes
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
