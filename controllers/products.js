// Import Mongoose Model
const Product = require("../models/product");

// This is a Test endpoint
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ name: "wooden desk" });
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find(req.query);
  res.status(200).json({ products, numHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
