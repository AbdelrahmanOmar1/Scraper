const mongoose = require("mongoose");
const chalk = require("chalk");
const app = require("./app");

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
