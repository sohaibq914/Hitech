const Product = require("../models/product"); // the products exports model

module.exports.index = async (req, res) => {
  const products = await Product.find({}); // get all products
  res.render("products/index", { products });
};

module.exports.renderNewForm = (req, res) => {
  res.render("products/new");
};
