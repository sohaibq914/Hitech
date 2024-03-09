const express = require("express");
const router = express.Router();
const products = require("../controllers/products");
const { validateProduct } = require("../middleware");

const catchAsync = require("../utils/catchAsync");

const multer = require("multer");
const { storage } = require("../cloudinary"); // node looks for index.js by default
const upload = multer({ storage }); // saying multer to store image in cloudinary

router

  .route("/")

  .get(catchAsync(products.index))
  .post(upload.array("image"), validateProduct, catchAsync(products.createProduct));

//! will need to add a admin permission here to access the new form
router.get("/new", products.renderNewForm); // we don't need to use .route() here because we're only using one method

router

  .route("/:id")

  .get(catchAsync(products.showProduct))
  .put(upload.array("image"), validateProduct, catchAsync(products.updateProduct))
  .delete(catchAsync(products.deleteProduct));

router.get("/:id/edit", catchAsync(products.renderEditForm));

module.exports = router;
