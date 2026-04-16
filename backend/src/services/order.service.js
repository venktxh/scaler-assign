const db = require("../config/db");

const USER_ID = "default_user";

exports.placeOrder = async (address) => {
  const connection = await db.getConnection();

  try {
    // ✅ 1. Validate input early
    if (!address || address.trim().length < 5) {
      throw new Error("Invalid delivery address");
    }

    await connection.beginTransaction();

    // ✅ 2. Get cart
    const [cartRows] = await connection.query(
      "SELECT id FROM Cart WHERE userId = ?",
      [USER_ID],
    );

    if (cartRows.length === 0) {
      throw new Error("Cart not found");
    }

    const cartId = cartRows[0].id;

    // ✅ 3. Lock cart items (IMPORTANT for concurrency)
    const [items] = await connection.query(
      `
      SELECT ci.productId, ci.quantity, p.price, p.stock
      FROM CartItem ci
      JOIN Product p ON ci.productId = p.id
      WHERE ci.cartId = ?
      FOR UPDATE
      `,
      [cartId],
    );

    // ✅ 4. Empty cart check
    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    // ✅ 5. Validate each item
    for (let item of items) {
      if (item.quantity <= 0) {
        throw new Error("Invalid cart quantity");
      }

      if (item.stock === null) {
        throw new Error("Product not found");
      }

      if (item.quantity > item.stock) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    // ✅ 6. Calculate total safely
    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    if (total <= 0) {
      throw new Error("Invalid order total");
    }

    // ✅ 7. Create order
    const [orderResult] = await connection.query(
      `
      INSERT INTO Orders (userId, totalAmount, address)
      VALUES (?, ?, ?)
      `,
      [USER_ID, total, address],
    );

    const orderId = orderResult.insertId;

    // ✅ 8. Insert order items + reduce stock safely
    for (let item of items) {
      // Insert item
      await connection.query(
        `
        INSERT INTO OrderItem (orderId, productId, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.productId, item.quantity, item.price],
      );

      // Atomic stock update
      const [updateResult] = await connection.query(
        `
        UPDATE Product 
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?
        `,
        [item.quantity, item.productId, item.quantity],
      );

      // If no rows updated → race condition detected
      if (updateResult.affectedRows === 0) {
        throw new Error(`Stock update failed for product ${item.productId}`);
      }
    }

    // ✅ 9. Clear cart
    await connection.query("DELETE FROM CartItem WHERE cartId = ?", [cartId]);

    await connection.commit();

    return {
      success: true,
      message: "Order placed successfully",
      orderId,
      total,
    };
  } catch (err) {
    await connection.rollback();

    // ✅ Clean error handling
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
    SELECT * FROM Orders 
    ORDER BY createdAt DESC
  `);

  return orders;
};

// ✅ GET ORDER BY ID (optional but good)
exports.getOrderById = async (id) => {
  const [orders] = await db.query("SELECT * FROM Orders WHERE id = ?", [id]);

  if (orders.length === 0) return null;

  const order = orders[0];

  // 🔥 fetch items also
  const [items] = await db.query(
    `
    SELECT oi.*, p.name
    FROM OrderItem oi
    JOIN Product p ON oi.productId = p.id
    WHERE oi.orderId = ?
    `,
    [id],
  );

  return { ...order, items };
};
