export default function ProductCard({ item }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:scale-105 hover:bg-white/20 transition duration-300 shadow-lg">
      <img
        src={item.image}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      <h2 className="text-lg font-bold line-clamp-2">{item.title}</h2>

      <div className="flex justify-between text-sm text-white/70 mt-2">
        <span className="text-green-400 font-semibold">{item.price}</span>
        <span>⭐ {item.rating || "N/A"}</span>
      </div>

      <p className="text-xs text-blue-300 mt-2 uppercase">{item.source}</p>

      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-center bg-blue-500 hover:bg-blue-400 py-2 rounded-xl transition"
      >
        View Deal
      </a>
    </div>
  );
}
