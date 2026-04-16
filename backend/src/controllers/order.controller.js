const service = require("../services/order.service");

exports.placeOrder = async (req, res) => {
  try {
    const { address } = req.body;

    const result = await service.placeOrder(address);

    res.status(200).json(result);
  } catch (err) {
    console.error("ORDER ERROR:", err.message);

    // ✅ Proper status codes
    if (
      err.message.includes("Cart") ||
      err.message.includes("stock") ||
      err.message.includes("Invalid")
    ) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
      error: "Something went wrong while placing order",
    });
  }
};

// ✅ GET ALL ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await service.getOrders();
    res.json(orders);
  } catch (err) {
    console.error("ORDER FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await service.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("ORDER FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
