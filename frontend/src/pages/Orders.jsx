import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ NEW

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        console.log("Orders API:", res.data); // 🔥 debug
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    fetchOrders();
  }, []);

  // ✅ show loading first
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <h2 className="text-xl">Loading orders...</h2>
      </div>
    );
  }

  // ✅ show empty only AFTER loading
  if (!orders.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <h2 className="text-xl font-semibold">No Orders Yet</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>

        {orders.map((order) => (
          <div key={order.id} className="border-b py-4">
            <p className="font-medium">Order ID: {order.id}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>Address: {order.address}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
