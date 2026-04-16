const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");

// ✅ GET all orders
router.get("/", controller.getOrders);

// ✅ GET single order by ID
router.get("/:id", controller.getOrderById);

// ✅ PLACE ORDER
router.post("/", controller.placeOrder);

module.exports = router;
