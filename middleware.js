const { productSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Product = require("./models/product");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // req.originalURL is from passport
    // it gets filled with URL you were going to when you were not logged in
    req.session.returnTo = req.originalUrl; // stores the url, user was trying to go to
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next(); // if already logged in
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    // getting the message of every error in object
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400); // q: why i'm getting this when submitting new form?
  } else {
    next();
  }
};

// so that only the admin can edit it
// can't bypass even thru postman
module.exports.isAdmin = async (req, res, next) => {
  if (req.user.username !== "admin") {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/products`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/products/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  if (req.body.review.rating == 0) {
    req.flash("error", "Rating can not be 0!");
    return res.redirect(`/products/${req.params.id}`);
  }
  // req.body has rating and body
  const { error } = reviewSchema.validate(req.body); // checks the rating and body with joi review schema requirements
  if (error) {
    // getting the message of every error in object
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
