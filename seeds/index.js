const mongoose = require("mongoose");
const Product = require("../models/product"); // the campground exports model

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
  for (let i = 0; i < productsArray.length; i++) {
    const price = Math.floor(Math.random() * 20) + 10;
    const newProduct = new Product({
      name: productsArray[i],
      images: [
        {
          url: `https://images.unsplash.com/photo-1579168765467-3b235f938439?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
          filename: "unsplash-image", // Optional: add a filename if needed
        },
      ],
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
