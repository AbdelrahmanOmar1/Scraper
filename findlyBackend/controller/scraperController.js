const Product = require("../models/dataModel");
const orchestrator = require("../services/searchService");

exports.searchProducts = async (req, res) => {
  try {
    const { q, source } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Query (q) is required" });
    }

    const query = q.trim();

    const sources = source
      ? source.split(",").map((s) => s.trim().toLowerCase())
      : ["noon", "amazon"];

    console.log("📦 Sources selected:", sources);

    await Product.deleteMany();

    console.log("🗑️ Old data removed for:", query);

    const results = await orchestrator.search(query, sources);

    const sourceStats = {
      amazon: 0,
      noon: 0,
    };

    results.forEach((p) => {
      if (p.source === "amazon") sourceStats.amazon++;
      if (p.source === "noon") sourceStats.noon++;
    });

    if (results.length > 0) {
      await Product.insertMany(
        results.map((p) => ({
          ...p,
          searchQuery: query,
        })),
      );
    }

    return res.json({
      success: true,
      query,
      sources,
      inserted: results.length,
      breakdown: sourceStats,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: err.message,
    });
  }
};
