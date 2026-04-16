const db = require("../config/db");

const USER_ID = "default_user";

exports.placeOrder = async (address) => {
  const connection = await db.getConnection();

  try {
    if (!address || address.trim().length < 5) {
      throw new Error("Invalid delivery address");
    }

    await connection.beginTransaction();

    // ✅ lowercase table names
    const [cartRows] = await connection.query(
      "SELECT id FROM cart WHERE userId = ?",
      [USER_ID],
    );

    if (cartRows.length === 0) {
      throw new Error("Cart not found");
    }

    const cartId = cartRows[0].id;

    const [items] = await connection.query(
      `
      SELECT ci.productId, ci.quantity, p.price, p.stock
      FROM cartitem ci
      JOIN product p ON ci.productId = p.id
      WHERE ci.cartId = ?
      FOR UPDATE
      `,
      [cartId],
    );

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (let item of items) {
      if (item.quantity <= 0) throw new Error("Invalid cart quantity");
      if (item.stock === null) throw new Error("Product not found");
      if (item.quantity > item.stock)
        throw new Error(`Insufficient stock for product ${item.productId}`);
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders (userId, totalAmount, address)
      VALUES (?, ?, ?)
      `,
      [USER_ID, total, address],
    );

    const orderId = orderResult.insertId;

    for (let item of items) {
      await connection.query(
        `
        INSERT INTO orderitem (orderId, productId, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.productId, item.quantity, item.price],
      );

      const [updateResult] = await connection.query(
        `
        UPDATE product 
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
        `,
        [item.quantity, item.productId, item.quantity],
      );

      if (updateResult.affectedRows === 0) {
        throw new Error(`Stock update failed for product ${item.productId}`);
      }
    }

    await connection.query("DELETE FROM cartitem WHERE cartId = ?", [cartId]);

    await connection.commit();

    return {
      success: true,
      message: "Order placed successfully",
      orderId,
      total,
    };
  } catch (err) {
    await connection.rollback();

    if (err.message.includes("stock")) {
      throw new Error("Some items are out of stock");
    }

    throw err;
  } finally {
    connection.release();
  }
};

// ✅ GET ALL ORDERS
exports.getOrders = async () => {
  const [orders] = await db.query(`
    SELECT * FROM orders 
    ORDER BY createdAt DESC
  `);

  return orders;
};

// ✅ GET ORDER BY ID
exports.getOrderById = async (id) => {
  const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);

  if (orders.length === 0) return null;

  const order = orders[0];

  const [items] = await db.query(
    `
    SELECT oi.*, p.name
    FROM orderitem oi
    JOIN product p ON oi.productId = p.id
    WHERE oi.orderId = ?
    `,
    [id],
  );

  return { ...order, items };
};
