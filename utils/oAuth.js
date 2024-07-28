const User = require("../models/user");
const mongoose = require("mongoose");
const Cart = require("../models/cart"); // the cart exports model

exports.authUser = async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    const username = email ? email.split("@")[0] : profile.id;
    console.log("EMAIL", email);
    console.log("USERNAME", username);
    if (!req.user) {
      // look for google user in db
      const googleUser = await User.findOne({ googleId: profile.id });
      if (googleUser) {
        return done(null, googleUser);
      } else {
        const newCart = new Cart();
        await newCart.save();
        const newGoogleUser = new User({
          googleId: profile.id,
          google_token: accessToken,
          email: email,
          cart: newCart._id, // Assign the newly created cart
          username: username,
        });
        await newGoogleUser.save();
        return done(null, newGoogleUser);
      }
    } else {
      return done(null, false, req.flash("error", "You are already logged in"));
    }
  } catch (err) {
    req.flash("error", err.message);
    return done(err, null);
  }
};
