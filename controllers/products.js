// Import Mongoose Model
const Product = require("../models/product");

// This is a Test endpoint
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ name: "wooden desk" });
  res.status(200).json({ products });
};

const getAllProducts = async (req, res) => {
  // Extract only the supported query params : ignore the rest (Mongoose V5)
  const { featured, company, name, sort, fields } = req.query;
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

  //Sort
  if (sort) {
    // input comes as one long coma separated string.
    // should be space separated acc to Mongoose docs
    sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    // Default sort if not passed
    result = result.sort("createdAt");
  }

  // Select
  if (fields) {
    fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }
  // Extract user-given page number or default to 1
  const page = Number(req.query.page) || 1;
  // Extract user-given num of items requested or default to 10
  const limit = Number(req.query.limit) || 10;
  // set number of documents in collection to be skipped
  const skip = (page - 1) * limit;

  // If skip is zero page num begins from page 1 and returns items by limit given
  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ numHits: products.length, products });
};

module.exports = { getAllProducts, getAllProductsStatic };
