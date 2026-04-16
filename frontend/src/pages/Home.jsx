// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import ProductGrid from "../components/ProductGrid";
// import Footer from "../components/Footer";

// export default function Home() {
//   return (
//     <>
//       <Hero />
//       <ProductGrid />
//     </>
//   );
// }
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  // 🔍 Get search query
  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  return (
    <>
      {/* HERO */}
      <Hero />

      {/* 🔥 SHOW SEARCH RESULT TITLE */}
      {search && (
        <div className="bg-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold">Results for "{search}"</h2>
        </div>
      )}

      {/* PRODUCTS */}
      <ProductGrid />
    </>
  );
}
