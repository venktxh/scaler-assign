import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Add to Cart
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setMessage("");

      await addToCart(product.id, 1);
      await fetchCart();

      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIXED BUY NOW
  const handleBuyNow = async () => {
    try {
      setLoading(true);

      // add product to cart
      await addToCart(product.id, 1);

      // refresh cart
      await fetchCart();

      // go to checkout
      navigate("/checkout");
    } catch (err) {
      console.error("Buy Now Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <h2 className="p-10 text-center">Loading...</h2>;
  }

  // 🔥 Image handling
  const imageUrl =
    product.images?.[0] || product.url || "https://via.placeholder.com/400";

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow grid md:grid-cols-2 gap-8">
        {/* LEFT - IMAGE */}
        <div className="flex justify-center items-center">
          <img
            src={`${imageUrl}?auto=format&fit=crop&w=800&q=80`}
            onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
            className="h-[400px] object-contain"
            alt={product.name}
          />
        </div>

        {/* RIGHT - DETAILS */}
        <div className="flex flex-col">
          {/* TITLE */}
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="text-yellow-500 text-sm mb-2">
            ★★★★☆ <span className="text-gray-500">(120 ratings)</span>
          </div>

          {/* PRICE */}
          <p className="text-3xl text-red-600 font-bold mb-3">
            ₹{product.price}
          </p>

          {/* DELIVERY */}
          <p className="text-sm text-gray-600 mb-3">
            FREE delivery by <span className="font-medium">Tomorrow</span>
          </p>

          {/* STOCK */}
          <p className="text-green-600 font-semibold mb-4">In Stock</p>

          {/* DESCRIPTION */}
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-medium">
              {loading ? "Adding..." : "Add to Cart"}
            </button>

            {/* 🔥 BUY NOW (FIXED) */}
            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium">
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>

          {/* MESSAGE */}
          {message && <p className="text-sm mt-3 text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
