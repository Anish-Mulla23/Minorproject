const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config/config");

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to log all requests (for debugging purposes)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/users", userRoutes); // User registration, login, profile, etc.
app.use("/api/products", productRoutes); // CRUD operations on products
app.use("/api/wishlist", wishlistRoutes); // Wishlist functionality
app.use("/api/cart", cartRoutes); // Cart functionality

// Error Handling Middleware
app.use(notFound); // Handles 404 - Not Found
app.use(errorHandler); // Handles other errors

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
