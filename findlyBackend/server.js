require("dotenv").config(); 
const mongoose = require("mongoose");
const chalk = require("chalk");
const app = require("./app");

// uncaughtException
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//Connect DB
mongoose
  .connect(process.env.monogDB)
  .then(console.log(chalk.yellow("Connected to DB Successfully....")))
  .catch((err) => {
    console.log(chalk.red("DB Connection Faild!⛔", err));
  });

// Ruuning Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(chalk.blue(`Server is running on port ${PORT}...`));
});

//unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
