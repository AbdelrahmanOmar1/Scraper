require("dotenv").config();
const mongoose = require("mongoose");
const chalk = require("chalk");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.yellow("Connected to DB Successfully....")))
  .catch((err) => {
    console.log(chalk.red("DB Connection Failed!⛔", err));
  });

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(chalk.blue(`Server is running on port ${PORT}...`));
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
