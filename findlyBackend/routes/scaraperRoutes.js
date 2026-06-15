const express = require("express");
const router = express.Router();
const scraperController = require("../controller/scraperController");

router.post("/findly", scraperController.searchProducts);

module.exports = router;
