import { useLocation, Link } from "react-router-dom";

export default function Success() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h2 className="text-xl font-semibold">No order found</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
        {/* ICON */}
        <div className="text-green-500 text-5xl mb-4">✅</div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>

        <p className="text-gray-600 mb-4">Thank you for shopping with us 🎉</p>

        {/* DETAILS */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="text-sm">
            <span className="font-medium">Order ID:</span> {state.orderId}
          </p>
          <p className="text-sm mt-1">
            <span className="font-medium">Total Amount:</span> ₹{state.total}
          </p>
        </div>

        {/* BUTTON */}
        <Link
          to="/"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded font-medium">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
