export default function SortBar({ sort, setSort, visible }) {
  if (!visible) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 flex justify-center">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-lg">
        <span className="text-xs text-white/50 px-2">Sort:</span>

        <button
          onClick={() => setSort("")}
          className={`cursor-pointer px-3 py-1 rounded-xl text-sm transition ${
            sort === ""
              ? "bg-white text-black"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          Default
        </button>

        <button
          onClick={() => setSort("price_asc")}
          className={`cursor-pointer px-3 py-1 rounded-xl text-sm transition ${
            sort === "price_asc"
              ? "bg-green-500 text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          Price ↑
        </button>

        <button
          onClick={() => setSort("price_desc")}
          className={`cursor-pointer px-3 py-1 rounded-xl text-sm transition ${
            sort === "price_desc"
              ? "bg-red-500 text-white"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          Price ↓
        </button>
      </div>
    </div>
  );
}
