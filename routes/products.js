const express = require("express");
const router = express.Router();
const products = require("../controllers/products");

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { storage } = require("../cloudinary"); // node looks for index.js by default
const upload = multer({ storage }); // saying multer to store image in cloudinary

router

  .route("/")

  .get(catchAsync(products.index))

  .post(upload.array("image"), products.createProduct);

//! will need to add a admin permission here to access the new form
router.get("/new", products.renderNewForm); // we don't need to use .route() here because we're only using one method

module.exports = router;
