export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white mt-10">
      {/* BACK TO TOP */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-[#37475a] text-center py-3 text-sm cursor-pointer hover:bg-[#485769] transition">
        Back to Top
      </div>

      {/* MAIN FOOTER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-10 py-10 text-sm">
        <div>
          <h3 className="font-bold mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Press Releases</li>
            <li className="hover:underline cursor-pointer">Amazon Science</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Connect with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Facebook</li>
            <li className="hover:underline cursor-pointer">Twitter</li>
            <li className="hover:underline cursor-pointer">Instagram</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Sell on Amazon</li>
            <li className="hover:underline cursor-pointer">
              Affiliate Program
            </li>
            <li className="hover:underline cursor-pointer">
              Advertise Products
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Your Account</li>
            <li className="hover:underline cursor-pointer">Returns Centre</li>
            <li className="hover:underline cursor-pointer">Help</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-600 text-center py-4 text-gray-400 text-xs">
        © 2026 Amazon Clone. All rights reserved.
      </div>
    </footer>
  );
}
