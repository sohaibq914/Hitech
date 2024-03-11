const mongoose = require("mongoose");
const Product = require("../models/product"); // the campground exports model
const fs = require("fs").promises;
const path = require("path");

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

const productsArray = ["Agglutination Viewer", "Blood Bag Shaker", "Blood Bag Tube Stripper", "GENESIS Blood Collection Mixer", "Manual Plasma Extractor", "Masimo Radical 7 Pulse Oximeter Touchscreen", "Masimo Radical 7 Rainbow Pulse Oximeter", "Nellcor DOC-10 Spo2 Adapter Cable", "Nellcor DS-100A SpO2 Adult Finger Probe Sensor Cable", "Welch Allyn 02895-000 Oral Thermometer Probe for Suretemp 690 & 692"];

const seedDB = async () => {
  await Product.deleteMany({}); // Delete all existing products
  const imagesDir = path.join(__dirname, "/../public/images");
  const imageFiles = await fs.readdir(imagesDir);
  for (let i = 0; i < productsArray.length; i++) {
    const price = Math.floor(Math.random() * 20) + 10;
    const imageUrl = `/images/${imageFiles[i % imageFiles.length]}`;
    const newProduct = new Product({
      author: "65ed0bf0ff52986d7002e3bb",
      name: productsArray[i],
      images: [
        {
          url: imageUrl, // Optional: add a default image if needed
          filename: "unsplash-image", // Optional: add a filename if needed
        },
      ],
      stockCount: 10,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam ex totam blanditiis illum fugiat perferendis quidem ut debitis voluptate modi, molestiae beatae optio sequi distinctio veniam consectetur et suscipit! Quod.",
      features: [
        "Feature 1: Description",
        "Feature 2: Description",
        "Feature 3: Description",
        // Add as many features as needed
      ],
      price: price,
    });
    await newProduct.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
