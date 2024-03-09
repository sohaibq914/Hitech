// if we are in development mode, then require dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

// const { campgroundSchema } = require("./schemas.js");
// const catchAsync = require("./utils/catchAsync");
// const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Product = require("./models/product"); // the product exports model

const productRoutes = require("./routes/products");

mongoose.connect("mongodb://127.0.0.1:27017/hitech", {
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

app.use(flash());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // absolute path, tell express where to find views

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // middleware to serve static files

app.use("/products", productRoutes);

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

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
