// if we are in development mode, then require dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

const session = require("express-session");

const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

const secret = process.env.SECRET || "thisshouldbeabettersecret!";
// const catchAsync = require("./utils/catchAsync");
// const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const oAuthRoutes = require("./routes/oAuth");
const _passport = require("./utils/passport");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// const User = require("./models/user");
const Product = require("./models/product"); // the product exports model

// const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/reviews");
const cartRoutes = require("./routes/cart");
const appRoutes = require("./routes/app");

const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/hitech";
// for some reason, this can't be localhost
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true // no longer supported
});
// testing if db connects
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

const app = express();
app.use(express.json()); // This line is crucial

// middleware to enforce HTTPS
/*
if (process.env.NODE_ENV == "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}
  */

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // every 24 hours
  crypto: {
    secret,
  },
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  // settings for the cookie
  cookie: {
    httpOnly: true, // for a bit of security so js can't access or change cookie
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // this is a week from now
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());

// app.use(helmet());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // absolute path, tell express where to find views
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // middleware to serve static files

_passport.passportInit(app);

/*
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // authenticate with local strategy

passport.serializeUser(User.serializeUser()); // how to store user in session
passport.deserializeUser(User.deserializeUser()); // how to unstore user in session
*/

app.use((req, res, next) => {
  // if we logout and this middleware runs on every request, then req.user will be null
  // this will allow us to alter menu using currentUser state
  res.locals.currentUser = req.user; // access to currentUser in ALL templates (from passport)
  res.locals.success = req.flash("success"); // access to success message in ALL templates
  res.locals.error = req.flash("error"); // access to error message in ALL templates
  next();
});

app.use("/", userRoutes);
app.use("/auth", oAuthRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/reviews", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/", appRoutes);

app.get("/", (req, res) => {
  res.render("main"); // looks inside the views directory
});

// will only run if nothing else has matched first
// for every request (.all) and for every path ("*")
app.all("*", (req, res, next) => {
  // passing to next() which will go error handler
  next(new ExpressError("Page Not Found"), 404);
});

// middleware error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

// process.env.PORT should already be set by heroku
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
