const express = require("express");
const router = express.Router();
const products = require("../controllers/products");

router.route("/").get(products.index);

module.exports = router;
