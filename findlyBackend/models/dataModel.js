const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    price: String,
    currency: { type: String, default: "USD" },
    image: String,
    link: String,
    source: {
      type: String,
      enum: ["noon", "amazon", "alibaba"],
    },

    searchQuery: String,
    rating: Number,
    reviews: Number,
    availability: Boolean,
    createdAt: { type: Date, default: Date.now, expires: 3600 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
