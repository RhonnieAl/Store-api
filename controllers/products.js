// Import Mongoose Model
const Product = require("../models/product");

// This is a Test endpoint
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ name: "wooden desk" });
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  // Extract only the supported query params : ignore the rest (Mongoose V5)
  const { featured, company, name } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = { $regex: company, $options: "i" };
  }

  if (name) {
    // regex: case incensitive and allows partial name input
    queryObject.name = { $regex: name, $options: "i" };
  }
  const products = await Product.find(queryObject);
  res.status(200).json({ numHits: products.length, products });
};

module.exports = { getAllProducts, getAllProductsStatic };
