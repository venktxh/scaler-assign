import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

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
