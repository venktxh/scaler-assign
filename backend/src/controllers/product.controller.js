const service = require("../services/product.service");

// ✅ GET ALL PRODUCTS (WITH SEARCH + FILTER + PAGINATION)
exports.getProducts = async (req, res) => {
  try {
    const { search, category, page, limit } = req.query;

    const products = await service.getProducts({
      search,
      category,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.json(products);
  } catch (err) {
    console.error("❌ CONTROLLER ERROR:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// ✅ GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const product = await service.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ CONTROLLER ERROR:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// ✅ GET ALL CATEGORIES (BONUS)
exports.getCategories = async (req, res) => {
  try {
    const categories = await service.getCategories();
    res.json(categories);
  } catch (err) {
    console.error("❌ CATEGORY ERROR:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};
