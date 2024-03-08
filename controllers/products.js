const Product = require("../models/product"); // the products exports model

module.exports.index = async (req, res) => {
  const products = await Product.find({}); // get all products
  res.render("products/index", { products });
};

module.exports.renderNewForm = (req, res) => {
  res.render("products/new");
};

module.exports.createProduct = async (req, res, next) => {
  const product = new Product(req.body.product);
  product.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await product.save();
  console.log(product);
  res.redirect(`/products`);
  // res.redirect(`/products/${product._id}`);
};
