const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Product name (required)
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true, // Trim whitespace from both ends of the string
      maxLength: [100, "Product name cannot exceed 100 characters"], // Max length constraint
    },

    // Product description (required)
    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: [500, "Description cannot exceed 500 characters"], // Max length constraint
    },

    // Product price (required and must be a positive number)
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"], // Validation to ensure price is greater than or equal to 0
    },

    // Product category (required and has predefined values)
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Electronics", "Clothing", "Home", "Other"], // Valid categories
        message:
          "Category must be one of the following: Electronics, Clothing, Home, or Other",
      },
    },

    // Product stock (required, with default of 0, must be >= 0)
    stock: {
      type: Number,
      required: true,
      default: 0, // Default stock is 0 if not provided
      min: [0, "Stock cannot be negative"], // Stock cannot be negative
    },

    // Product brand (optional)
    brand: {
      type: String,
      required: [true, "Brand is required"], // Make brand required, or set it to false if optional
      trim: true, // Trim whitespace
    },

    // Product rating (optional, must be between 0 and 5)
    rating: {
      type: Number,
      min: [0, "Rating must be between 0 and 5"],
      max: [5, "Rating must be between 0 and 5"],
      default: 0, // Default rating is 0 if not provided
    },

    // Number of reviews (optional, default is 0)
    numReviews: {
      type: Number,
      default: 0, // Default number of reviews is 0
    },

    // Featured flag (optional, indicates if the product is featured)
    featured: {
      type: Boolean,
      default: false, // Default to false if not provided
    },

    // Product image (optional, default image URL if not provided)
    image: {
      type: String,
      default: "https://example.com/default-image.jpg", // Default image URL
    },

    // Warranty period (optional, defaults to 0)
    warrantyPeriod: {
      type: Number,
      default: 0, // Default warranty period is 0 days if not provided
      min: [0, "Warranty period cannot be negative"], // Warranty period cannot be negative
    },

    // Created date (automatically generated)
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to current date
    },

    // Updated date (automatically generated when the product is updated)
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set to current date when updated
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create and export the Product model
module.exports = mongoose.model("Product", productSchema);
