import { useState, memo } from "react";
import { addToCart } from "../api/cartApi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCartLocal } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 FIX: use images[0] instead of url
  const imageUrl = product.images?.[0]
    ? `${product.images[0]}?auto=format&fit=crop&w=500&q=80`
    : "https://via.placeholder.com/200";

  // ✅ ADD TO CART
  const handleAdd = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);
      setMessage("");

      // 🔥 instant UI update
      addToCartLocal(product);

      // 🔥 backend sync
      addToCart(product.id, 1);

      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-4 cursor-pointer flex flex-col justify-between">
      {/* TITLE */}
      <h2 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
        {product.name}
      </h2>

      {/* 🔥 IMAGE (FIXED) */}
      <div className="flex justify-center items-center h-48 overflow-hidden mb-2 bg-white">
        <div
          className="h-full w-full bg-center bg-contain bg-no-repeat transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `url("${imageUrl}")`, // ✅ IMPORTANT FIX
          }}
        />
      </div>

      {/* PRICE */}
      <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>

      {/* DESCRIPTION */}
      <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[32px]">
        {product.description}
      </p>

      {/* RATING */}
      <div className="text-yellow-500 text-xs mt-1 flex items-center gap-1">
        ★★★★☆
        <span className="text-gray-500">(120)</span>
      </div>

      {/* DELIVERY */}
      <p className="text-xs text-gray-600 mt-1">FREE delivery by tomorrow</p>

      {/* BUTTON */}
      <button
        onClick={handleAdd}
        disabled={loading}
        className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition transform py-2 rounded text-sm font-medium disabled:opacity-50">
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {/* MESSAGE */}
      {message && <p className="text-xs mt-2 text-green-600">{message}</p>}
    </div>
  );
}

export default memo(ProductCard);
