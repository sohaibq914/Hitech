const Cart = require("../models/cart"); // the cart exports model
const Product = require("../models/product"); // the products exports model
const User = require("../models/user"); // the user exports model

module.exports.addProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("author");
  const quantity = req.body.quantity;

  // q: why is the quantity undefined?
  // a: because i'm not destructuring it properly
  // q: why is it not destructuring properly?
  // a: because i'm not using the right syntax
  // q: what is the right syntax?
  // a: const { quantity } = req.body;

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
    cart.items[productIndex].quantity += parseInt(quantity, 10);
  }
  // is not already in cart
  else {
    cart.items.push({ product: product._id, quantity: parseInt(quantity, 10) });
  }
  console.log("BEFORRREEE", cart);
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
