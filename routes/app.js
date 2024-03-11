const express = require("express");
const router = express.Router();
const app = require("../controllers/app");

router.get("/aboutus", app.aboutus);
router.post("/create-checkout-session", app.createCheckoutSession);

module.exports = router;
