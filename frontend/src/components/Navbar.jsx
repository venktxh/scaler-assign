import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // 🔍 Handle search
  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/");
    } else {
      navigate(`/?search=${search}`);
    }
  };

  // ⌨️ Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="bg-[#131921] text-white">
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* LOGO */}
        <div
          onClick={() => {
            setSearch("");
            navigate("/");
          }}
          className="text-xl font-bold cursor-pointer hover:border border-white px-2 py-1">
          amazon<span className="text-yellow-400">.in</span>
        </div>

        {/* LOCATION */}
        <div className="hidden sm:flex flex-col text-xs cursor-pointer hover:border border-white px-2 py-1">
          <span className="text-gray-300">Deliver to</span>
          <span className="font-bold">India</span>
        </div>

        {/* SEARCH BAR */}
        <div className="flex flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search Amazon"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);

              if (value.trim() === "") {
                navigate("/");
              }
            }}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-black outline-none rounded-l-md"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-400 px-4 rounded-r-md hover:bg-yellow-500">
            🔍
          </button>
        </div>

        {/* ACCOUNT */}
        <div className="hidden md:flex flex-col text-xs cursor-pointer hover:border border-white px-2 py-1">
          <span className="text-gray-300">Hello, User</span>
          <span className="font-bold">Account & Lists</span>
        </div>

        {/* 🔥 ORDERS (FIXED) */}
        <div
          onClick={() => navigate("/orders")}
          className="hidden md:flex flex-col text-xs cursor-pointer hover:border border-white px-2 py-1">
          <span className="text-gray-300">Returns</span>
          <span className="font-bold">& Orders</span>
        </div>

        {/* CART */}
        <div
          onClick={() => navigate("/cart")}
          className="flex items-center gap-1 cursor-pointer hover:border border-white px-2 py-1">
          <span className="text-xl">🛒</span>
          <span className="font-bold text-sm">Cart</span>
        </div>
      </div>
    </header>
  );
}
