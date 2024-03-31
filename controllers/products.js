const Product = require("../models/product"); // the products exports model
const { cloudinary } = require("../cloudinary");
const Cart = require("../models/cart");

module.exports.index = async (req, res) => {
  if (req.query.success) {
    req.flash("success", "Purchase was successful!");
    res.redirect(`/products`);
  }
  // on first load, if no query string, get all products
  if (!req.query.page) {
    const products = await Product.paginate({}, { limit: 12 }); // get all products
    res.render("products/index", { products });
  } else {
    const { page } = req.query;
    const products = await Product.paginate(
      {},
      {
        page,
        limit: 12,
      }
    ); // get all products
    res.status(200).json(products);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("products/new");
};

module.exports.createProduct = async (req, res, next) => {
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
  product.author = req.user._id; // used req.user from passport
  await product.save();

  req.flash("success", "Successfully made a new product!");

  res.redirect(`/products/${product._id}`); // will trigger the showProduct function
  // res.redirect(`/products/${product._id}`);
};

module.exports.showProduct = async (req, res) => {
  const products = await Product.paginate({}, { limit: 12 });
  const product = await Product.findById(req.params.id)
    .populate({
      path: "reviews", // populate the reviews
      populate: {
        path: "author", // populate the authors inside the reviews
      },
    })
    .populate("author");
  if (!product) {
    req.flash("error", "Cannot find that product!");
    return res.redirect("/products");
  }
  res.render("products/show", { product, products });
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
  const updateData = req.body.features ? { ...req.body.product, features: req.body.features } : { ...req.body.product };

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true }); // Include { new: true } to return the updated document
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
    // Find all carts containing the product to be deleted and remove the product from those carts
    await Cart.updateMany({ "items.product": id }, { $pull: { items: { product: id } } });
  }
  await Product.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted product!");
  res.redirect("/products");
};
