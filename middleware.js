const { productSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Product = require("./models/product");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // req.originalURL is from passport
    // it gets filled with URL you were going to when you were not logged in
    console.log(req.originalUrl); // /products/new
    req.session.returnTo = req.originalUrl; // stores the url, user was trying to go to
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next(); // if already logged in
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    console.log("IM HERERER", req.session.returnTo);
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  console.log("after validation");
  if (error) {
    // getting the message of every error in object
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400); // q: why i'm getting this when submitting new form?
  } else {
    next();
  }
};

// so that only the author of the product can edit it
// can't bypass even thru postman
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product.author);
  if (!product.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/product/${id}`);
  }
  next();
};
