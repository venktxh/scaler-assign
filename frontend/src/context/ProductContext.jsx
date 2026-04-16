// import { createContext, useContext, useState, useEffect } from "react";
// import { getProducts } from "../api/productApi";

// const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await getProducts();

//         // 🔥 STORE ONCE
//         setProducts(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <ProductContext.Provider value={{ products, loading }}>
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProducts = () => useContext(ProductContext);
import { createContext, useContext, useState, useEffect } from "react";
import { getProducts } from "../api/productApi";
import { useLocation } from "react-router-dom";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation(); // 🔥 read URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 🔥 get search param from URL
        const params = new URLSearchParams(location.search);
        const search = params.get("search");

        // 🔥 build query object
        const query = {};
        if (search) query.search = search;

        const res = await getProducts(query);

        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]); // 🔥 re-run when URL changes

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
