import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function ProductGrid() {
  const { products, loading } = useProducts();

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6">
      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* 🔄 LOADING SKELETON */}
        {loading
          ? Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded shadow animate-pulse">
                  <div className="h-40 bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                </div>
              ))
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
