const db = require("../config/db");

// ✅ GET ALL PRODUCTS (WITH SEARCH + FILTER + PAGINATION)
exports.getProducts = async ({ search, category, page = 1, limit = 10 }) => {
  try {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        c.name AS category,
        GROUP_CONCAT(pi.url) AS images
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN productimage pi ON p.id = pi.productId
      WHERE 1=1
    `;

    const params = [];

    // 🔍 SEARCH
    if (search) {
      query += " AND p.name LIKE ?";
      params.push(`%${search}%`);
    }

    // 📂 CATEGORY FILTER
    if (category) {
      query += " AND c.name = ?";
      params.push(category);
    }

    query += " GROUP BY p.id";

    // 📄 PAGINATION
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(query, params);

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      images: p.images ? p.images.split(",") : [],
    }));
  } catch (err) {
    console.error("❌ SERVICE ERROR:", err);
    throw err;
  }
};

// ✅ GET PRODUCT BY ID
exports.getProductById = async (id) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        c.name AS category,
        GROUP_CONCAT(pi.url) AS images
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN productimage pi ON p.id = pi.productId
      WHERE p.id = ?
      GROUP BY p.id
      `,
      [id],
    );

    if (rows.length === 0) return null;

    const p = rows[0];

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      images: p.images ? p.images.split(",") : [],
    };
  } catch (err) {
    console.error("❌ SERVICE ERROR:", err);
    throw err;
  }
};

// ✅ GET ALL CATEGORIES (BONUS API)
exports.getCategories = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Category");
    return rows;
  } catch (err) {
    console.error("❌ CATEGORY ERROR:", err);
    throw err;
  }
};
