const db = require("../config/db");

const USER_ID = "default_user";

// 1. Get or create cart
async function getOrCreateCart() {
  const [rows] = await db.query("SELECT * FROM cart WHERE userId = ?", [
    USER_ID,
  ]);

  if (rows.length > 0) return rows[0];

  const [result] = await db.query("INSERT INTO cart (userId) VALUES (?)", [
    USER_ID,
  ]);

  return { id: result.insertId };
}

exports.addToCart = async (productId) => {
  const cart = await getOrCreateCart();

  const [product] = await db.query("SELECT * FROM product WHERE id = ?", [
    productId,
  ]);

  if (product.length === 0) {
    throw new Error("Product not found");
  }

  if (product[0].stock <= 0) {
    throw new Error("Product out of stock");
  }

  const [existing] = await db.query(
    "SELECT * FROM cartitem WHERE cartId = ? AND productId = ?",
    [cart.id, productId],
  );

  if (existing.length > 0) {
    await db.query("UPDATE cartitem SET quantity = quantity + 1 WHERE id = ?", [
      existing[0].id,
    ]);
  } else {
    await db.query(
      "INSERT INTO cartitem (cartId, productId, quantity) VALUES (?, ?, 1)",
      [cart.id, productId],
    );
  }

  return { message: "Added to cart" };
};

// 3. Get cart
exports.getCart = async () => {
  const cart = await getOrCreateCart();

  const [items] = await db.query(
    `
    SELECT 
      ci.id,
      p.name,
      p.price,
      ci.quantity,
      pi.url
    FROM cartitem ci
    JOIN product p ON ci.productId = p.id
    LEFT JOIN productimage pi ON p.id = pi.productId
    WHERE ci.cartId = ?
    GROUP BY ci.id, p.name, p.price, ci.quantity, pi.url
    `,
    [cart.id],
  );

  const mappedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.url || null,
  }));

  const total = mappedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return { items: mappedItems, total };
};

exports.updateCartItem = async (itemId, quantity) => {
  if (quantity === 0) {
    await db.query("DELETE FROM cartitem WHERE id = ?", [itemId]);
    return { message: "Item removed from cart" };
  }

  const [product] = await db.query(
    `
    SELECT stock FROM product 
    WHERE id = (
      SELECT productId FROM cartitem WHERE id = ?
    )
    `,
    [itemId],
  );

  if (product.length === 0) {
    throw new Error("Product not found");
  }

  if (quantity > product[0].stock) {
    throw new Error("Quantity exceeds available stock");
  }

  await db.query("UPDATE cartitem SET quantity = ? WHERE id = ?", [
    quantity,
    itemId,
  ]);

  return { message: "Cart updated" };
};

exports.removeCartItem = async (itemId) => {
  await db.query("DELETE FROM cartitem WHERE id = ?", [itemId]);
  return { message: "Item removed" };
};
