const express = require("express");
const router = express.Router();
const scraperController = require("../controller/scraperController");

router.get("/findly", scraperController.searchProducts);

module.exports = router;
