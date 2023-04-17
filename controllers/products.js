// Import Mongoose Model
const Product = require("../models/product");

// This is a Test endpoint
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ name: "wooden desk" });
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  // Extract only the supported query params : ignore the rest (Mongoose V5)
  const { featured, company, name, sort } = req.query;
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

  result = Product.find(queryObject);
  if (sort) {
    // input comes as one long coma separated string.
    // should be space separated acc to Mongoose docs
    sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    // Default sort if not passed
    result = result.sort("createdAt");
  }
  const products = await result;

  res.status(200).json({ numHits: products.length, products });
};

module.exports = { getAllProducts, getAllProductsStatic };
