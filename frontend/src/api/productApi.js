import client from "./client";

export const getProducts = (params) => client.get("/products", { params });

export const getProduct = (id) => client.get(`/products/${id}`);

export const getProductById = (id) => client.get(`/products/${id}`);
