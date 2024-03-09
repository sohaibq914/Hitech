const Product = require("../models/product"); // the products exports model

module.exports.index = async (req, res) => {
  const products = await Product.find({}); // get all products
  res.render("products/index", { products });
};

module.exports.renderNewForm = (req, res) => {
  res.render("products/new");
};

module.exports.createProduct = async (req, res, next) => {
  console.log("inside createProduct");
  const product = new Product(req.body.product);
  product.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  let incomingFeatures = req.body.features;

  // Check if incomingFeatures has at least one element (there should be because of the joi backend form validation but just in case)
  if (incomingFeatures.length) {
    incomingFeatures.forEach((feature) => {
      // Push each feature into the product's features array
      product.features.push(feature);
    });
  }

  product.features.push();
  await product.save();
  console.log(product);
  console.log(req.body.features);
  res.redirect(`/products`);
  // res.redirect(`/products/${product._id}`);
};
