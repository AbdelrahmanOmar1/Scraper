const Product = require("../models/dataModel");

async function saveProducts(products, query) {
  if (!products?.length) return;

  const docs = products.map((p) => ({
    ...p,
    searchQuery: query,
  }));

  await Product.insertMany(docs);
}

module.exports = saveProducts;
