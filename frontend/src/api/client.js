import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 🔥 FIXED
  timeout: 30000,
});

// 🔥 global error handling
client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  },
);

export default client;
