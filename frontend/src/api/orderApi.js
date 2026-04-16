import client from "./client";

// ✅ get all orders
export const getOrders = () => client.get("/orders");

// ✅ get order by id (optional)
export const getOrderById = (id) => client.get(`/orders/${id}`);
