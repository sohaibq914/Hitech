const express = require("express");
const router = express.Router();
const products = require("../controllers/products");
const cart = require("../controllers/cart");
const { isLoggedIn, isAdmin, validateProduct } = require("../middleware");

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { storage } = require("../cloudinary"); // node looks for index.js by default
const upload = multer({ storage }); // saying multer to store image in cloudinary

router
  .route("/")

  .get(catchAsync(cart.showCart));

router.route("/:id/add").post(isLoggedIn, catchAsync(cart.addProduct));

module.exports = router;
