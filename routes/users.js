const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/register") // if user goes to /register

  .get(users.renderRegister); // renders the register form

router.route("/login").get(users.renderLogin);

router.get("/logout", users.logout);

module.exports = router;
