import client from "./client";

export const getCart = () => client.get("/cart");

export const addToCart = (productId) => client.post("/cart", { productId });

export const updateCart = (id, quantity) =>
  client.put(`/cart/${id}`, { quantity });

export const removeCart = (id) => client.delete(`/cart/${id}`);
