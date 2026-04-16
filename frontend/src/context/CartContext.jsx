import { createContext, useContext, useState, useEffect, useMemo } from "react";
import * as cartApi from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ INITIAL FETCH (only once)
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await cartApi.getCart();

      // 🔥 IMPORTANT: normalize backend data
      const itemsWithImage = res.data.items.map((item) => ({
        ...item,
        image: item.image || item.url || item.images?.[0] || null,
      }));

      setCart({
        items: itemsWithImage,
        total: res.data.total,
      });
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 OPTIMISTIC UPDATE (FIXED)
  const addToCartLocal = (product) => {
    setCart((prev) => {
      const exists = prev.items.find((i) => i.id === product.id);

      let items;

      if (exists) {
        items = prev.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        items = [
          ...prev.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,

            // 🔥 FINAL FIX (IMAGE)
            image: product.images?.[0] || null,
          },
        ];
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return { items, total };
    });
  };

  // 🔥 MEMOIZED CONTEXT
  const value = useMemo(() => {
    return {
      cart,
      loading,
      error,
      fetchCart,
      addToCartLocal,
    };
  }, [cart, loading, error]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ✅ SAFE HOOK
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
