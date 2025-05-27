const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Simple home route to check if the API is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Route handlers for user, product, wishlist, and cart
app.use("/api/users", userRoutes); // Includes /api/users/profile
app.use("/api/products", productRoutes); // Includes /api/products
app.use("/api/wishlist", wishlistRoutes); // Includes /api/wishlist
app.use("/api/cart", cartRoutes); // Includes /api/cart
// app.use("/api/cart", require("./routes/cartRoutes"));

// Error handling middleware
app.use(notFound); // Handles 404 errors
app.use(errorHandler); // Handles other errors

// Middleware to log all requests (for debugging purposes)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
