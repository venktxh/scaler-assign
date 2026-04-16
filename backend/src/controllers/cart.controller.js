const service = require("../services/cart.service");
exports.addToCart = async (req, res) => {
  try {
    const result = await service.addToCart(req.body.productId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message }); // ✅ important
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await service.getCart();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const result = await service.updateCartItem(
      req.params.id,
      req.body.quantity,
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message }); // ✅ important
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const result = await service.removeCartItem(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
