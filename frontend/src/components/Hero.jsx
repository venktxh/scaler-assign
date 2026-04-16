export default function Hero() {
  return (
    <div className="relative">
      {/* BACKGROUND IMAGE */}
      <div
        className="h-[350px] md:h-[450px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1500&q=80')",
        }}></div>

      {/* OVERLAY GRADIENT (Amazon feel) */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-200 via-transparent to-transparent"></div>

      {/* TEXT BOX */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-white text-center py-3 shadow-md text-sm">
        You are on amazon.com. Shop millions of products.
      </div>
    </div>
  );
}
