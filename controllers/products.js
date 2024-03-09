const Product = require("../models/product"); // the products exports model
const { cloudinary } = require("../cloudinary");

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
  product.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
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
  req.flash("success", "Successfully made a new product!");

  res.redirect(`/products/${product._id}`); // will trigger the showProduct function
  // res.redirect(`/products/${product._id}`);
};

module.exports.showProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    req.flash("error", "Cannot find that product!");
    return res.redirect("/products");
  }
  res.render("products/show", { product });
};

module.exports.renderEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    req.flash("error", "Cannot find that product!");
    return res.redirect("/products"); // by returning it exits the entire func
  }

  res.render("products/edit", { product });
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log(req.body.product);
  console.log({ ...req.body.product });
  const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  // spreading to not make array inside array instead just adding object to original array
  product.images.push(...imgs);

  await product.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    // pull (remove) from images array where filename of image is in req.body.deleteImages
    await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash("success", "Successfully updated product!");
  res.redirect(`/products/${product._id}`);
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    // If there are images, delete them from Cloudinary
    if (product.images && product.images.length) {
      for (let image of product.images) {
        await cloudinary.uploader.destroy(image.filename);
      }
    }
  }
  await Product.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted product!");
  res.redirect("/products");
};
