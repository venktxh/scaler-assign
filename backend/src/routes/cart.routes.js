const express = require("express");
const router = express.Router();
const controller = require("../controllers/cart.controller");

router.post("/", controller.addToCart);
router.get("/", controller.getCart);
router.put("/:id", controller.updateCartItem);
router.delete("/:id", controller.removeCartItem);

module.exports = router;
