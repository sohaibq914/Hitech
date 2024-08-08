const Cart = require("../models/cart"); // the cart exports model
const Product = require("../models/product"); // the products exports model
const User = require("../models/user"); // the user exports model

module.exports.addProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("author");
  const quantity = req.body.quantity;

  const userId = req.user._id;
  if (!product) {
    req.flash("error", "Cannot find that product!");
    return res.redirect("/products");
  }
  let cart = await Cart.findOne({ _id: req.user.cart }).populate({
    path: "items.product", // populate the product
    populate: {
      path: "author", // populate the authors inside the product
    },
  });
  if (!cart) {
    cart = new Cart({ items: [] });
    await cart.save();

    const user = await User.findById(userId);
    user.cart = cart._id;
    await user.save();
  }

  const productIndex = cart.items.findIndex((item) => item.product.equals(product._id));

  // if in cart
  if (productIndex > -1) {
    if (product.stockCount > cart.items[productIndex].quantity + parseInt(quantity, 10)) {
      cart.items[productIndex].quantity += parseInt(quantity, 10);
    }
  }
  // is not already in cart
  else {
    cart.items.push({ product: product._id, quantity: parseInt(quantity, 10) });
  }
  await cart.save();

  req.flash("success", "Product added to cart successfully!");
  res.redirect("/cart");
};

module.exports.showCart = async (req, res) => {
  const cart = await Cart.findById(req.user.cart).populate({
    path: "items.product", // populate the product
    populate: {
      path: "author", // populate the authors inside the product
    },
  });

  res.render("cart/show", { cart });
};

module.exports.removeProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("author");
  const userId = req.user._id;

  // Attempt to find the user's cart
  let cart = await Cart.findOne({ _id: req.user.cart });

  if (!cart) {
    req.flash("error", "No cart found!");
    return res.redirect("/cart");
  }

  // Find the index of the product in the cart
  const productIndex = cart.items.findIndex((item) => item.product.equals(product._id));

  // If the product is found in the cart, remove it
  if (productIndex > -1) {
    cart.items.splice(productIndex, 1); // Remove the product from the items array
    await cart.save(); // Save the updated cart
    req.flash("success", "Product removed from cart successfully!");
  } else {
    // Product was not found in the cart
    req.flash("error", "Product not found in cart!");
  }

  // Redirect back to the cart page or to another appropriate page
  res.redirect("/cart");
};

module.exports.updateQuantity = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("author");
  const quantity = req.body.quantity;

  // Attempt to find the user's cart
  let cart = await Cart.findOne({ _id: req.user.cart });

  if (!cart) {
    req.flash("error", "No cart found!");
    return res.redirect("/cart");
  }

  // Find the index of the product in the cart
  const productIndex = cart.items.findIndex((item) => item.product.equals(product._id));

  // If the product is found in the cart, update the quantity
  if (productIndex > -1) {
    cart.items[productIndex].quantity = parseInt(quantity, 10); // Update the quantity
    await cart.save(); // Save the updated cart
    req.flash("success", "Cart updated successfully!");
  } else {
    // Product was not found in the cart
    req.flash("error", "Product not found in cart!");
  }

  // Redirect back to the cart page or to another appropriate page
  res.redirect("/cart");
};
