const mongoose = require("mongoose");

// Set up structure of the documents in the DB collection
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "Product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["Ikea", "Isku", "JYSK", "Masku"], // Restrict the companies available as options
      message: "{VALUE} is not supported", // Error message if input is different from above brands
    },
  },
});

// export the mongoose model (accepts name and schema)
module.exports = mongoose.model("Product", productSchema);
