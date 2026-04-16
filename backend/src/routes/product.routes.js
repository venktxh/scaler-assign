const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

// ✅ IMPORTANT: specific routes FIRST
router.get("/categories", controller.getCategories);

// ✅ GET ALL PRODUCTS (search, filter, pagination supported)
router.get("/", controller.getProducts);

// ✅ GET PRODUCT BY ID
router.get("/:id", controller.getProductById);

module.exports = router;
