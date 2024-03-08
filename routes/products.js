const express = require("express");
const router = express.Router();
const products = require("../controllers/products");

router.route("/").get(products.index);

//! will need to add a admin permission here to access the new form
router.get("/new", products.renderNewForm); // we don't need to use .route() here because we're only using one method

module.exports = router;
