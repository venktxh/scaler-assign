import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart } = useCart(); // 🔥 get cart data

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!address || address.length < 5) {
      return setError("Please enter a valid address");
    }

    try {
      setLoading(true);
      setError("");

      const res = await client.post("/orders", { address });

      navigate("/success", { state: res.data });
    } catch (err) {
      setError(err.response?.data?.error || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* LEFT - ADDRESS */}
        <div className="flex-1 bg-white p-6 shadow rounded">
          <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

          <h2 className="text-lg font-medium mb-2">Delivery Address</h2>

          <textarea
            placeholder="Enter your full delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-3 rounded h-32 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="w-full lg:w-[350px] bg-white p-6 shadow rounded h-fit sticky top-20">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {/* ITEMS */}
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{cart.total}</span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleOrder}
            disabled={loading}
            className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
