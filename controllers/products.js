const products = require("../products.json");

const getAllProducts = async (req, res) => {
  res.status(200).json({ products });
};

const getAllProductsStatic = async (req, res) => {
  // Handle errors using "express-async-errors" module
  throw new Error("Testing Async Error");
  res.status(200).json({ msg: "Success! This is a Test Route" });
};

module.exports = { getAllProducts, getAllProductsStatic };
