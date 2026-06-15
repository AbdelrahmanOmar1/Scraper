const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const scraperRoutes = require("./routes/scaraperRoutes");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", 
  })
);
app.use(morgan("dev"));

// Rourtes
app.use("/api/v1", scraperRoutes);
app.use("/api/v1", productRoutes);

//Unhandled Routes
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

module.exports = app;
