import { useCart } from "../context/CartContext";
import { updateCart, removeCart } from "../api/cartApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, fetchCart } = useCart();
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  // 🔄 Update quantity
  const handleUpdate = async (id, quantity) => {
    try {
      setLoadingId(id);

      if (quantity <= 0) {
        await removeCart(id);
      } else {
        await updateCart(id, quantity);
      }

      await fetchCart();
    } catch {
      console.error("Error updating cart");
    } finally {
      setLoadingId(null);
    }
  };

  // ❌ Remove item
  const handleRemove = async (id) => {
    try {
      setLoadingId(id);
      await removeCart(id);
      await fetchCart();
    } catch {
      console.error("Error removing item");
    } finally {
      setLoadingId(null);
    }
  };

  // 🛒 EMPTY CART UI
  if (!cart.items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty 🛒</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-medium">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* 🛍 LEFT SIDE */}
        <div className="flex-1 bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center border-b py-4 gap-4">
              {/* LEFT */}
              <div className="flex gap-4 items-center w-full md:w-auto">
                {/* IMAGE */}
                <img
                  src={
                    item.image
                      ? `${item.image}?auto=format&fit=crop&w=200&q=80`
                      : item.images?.[0]
                        ? `${item.images[0]}?auto=format&fit=crop&w=200&q=80`
                        : "https://via.placeholder.com/100"
                  }
                  alt={item.name}
                  className="w-24 h-24 object-contain"
                />

                {/* DETAILS */}
                <div>
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <p className="text-green-600 text-sm">In Stock</p>
                  <p className="text-gray-600 text-sm">₹{item.price}</p>

                  {/* QUANTITY */}
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      disabled={loadingId === item.id}
                      onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      className="px-2 border rounded">
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      disabled={loadingId === item.id}
                      onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      className="px-2 border rounded">
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    disabled={loadingId === item.id}
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 text-sm mt-2 hover:underline">
                    Remove
                  </button>
                </div>
              </div>

              {/* RIGHT PRICE */}
              <div className="font-semibold text-lg">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* 🧾 RIGHT SIDE SUMMARY */}
        <div className="w-full lg:w-[300px] bg-white p-6 shadow rounded h-fit sticky top-20">
          <h2 className="text-lg font-semibold mb-4">
            Subtotal ({cart.items.length} items)
          </h2>

          <p className="text-2xl font-bold mb-4">₹{cart.total}</p>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded font-medium">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
