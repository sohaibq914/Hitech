const User = require("../models/user");
const Cart = require("../models/cart");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const newCart = new Cart();
    await newCart.save();

    const user = new User({ email, username, cart: newCart._id });
    const registeredUser = await User.register(user, password); // hash and salts the password and stores info in document
    req.login(registeredUser, (err) => {
      if (err) return next(err); // callback necessary when using login func, can't use async --- that's just how passport does this
      req.flash("success", "Welcome to Hitech!");
      res.redirect("/products");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = // Now we can use res.locals.returnTo to redirect the user after login
  (req, res) => {
    req.flash("success", "Welcome Back!");
    // res.locals.returnTo url was stored in storeReturnTo middleware
    const redirectUrl = res.locals.returnTo || "/products";
    res.redirect(redirectUrl);
  };

// this route is only available when user is logged in
// we did this by only showing logout button when there we're logged in (there's a currentUser) in our templates
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err); // goes to error-handling middleware
    }
    req.flash("success", "Goodbye!");
    res.redirect("/products");
  });
};
