const passport = require("passport");

exports.loadGoogleLogin = async (req, res, next) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
};

exports.googleRegisterOrLogin = async (req, res, next) => {
  req.flash("success", "Welcome to Hitech!");
  const redirectUrl = req.session.returnTo || "/products";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
