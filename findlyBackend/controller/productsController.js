const Product = require("../models/dataModel");

exports.getProducts = async (req, res) => {
  try {
    const { q, min, max, source, sort } = req.query;

    const query = q?.trim();

    // ✅ BASE FILTER (NO REQUIRED QUERY)
    const filter = {};

    if (query) {
      filter.searchQuery = query;
    }

    if (source) {
      const sources = source.split(",").map((s) => s.trim().toLowerCase());
      filter.source = { $in: sources };
    }

    let results = await Product.find(filter);

    const minPrice = min ? Number(min) : null;
    const maxPrice = max ? Number(max) : null;

    if (minPrice !== null || maxPrice !== null) {
      results = results.filter((p) => {
        const price = Number((p.price || "").toString().replace(/[^\d]/g, ""));

        if (!price) return false;
        if (minPrice !== null && price < minPrice) return false;
        if (maxPrice !== null && price > maxPrice) return false;

        return true;
      });
    }

    const getPrice = (p) =>
      Number((p.price || "").toString().replace(/[^\d]/g, "")) || 0;

    if (sort === "price_asc") {
      results.sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sort === "price_desc") {
      results.sort((a, b) => getPrice(b) - getPrice(a));
    }

    if (sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({
      source: "db",
      query: query || null,
      count: results.length,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};
