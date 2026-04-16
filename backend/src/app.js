const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const productRoutes = require("./routes/product.routes");

app.use("/api/orders", orderRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/products", productRoutes);

module.exports = app;
