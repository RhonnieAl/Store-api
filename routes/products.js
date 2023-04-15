const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getAllProductsStatic,
} = require("../controllers/products");

router.use(express.json());

router.route("/").get(getAllProducts);
router.route("/test").get(getAllProductsStatic);

module.exports = router;
