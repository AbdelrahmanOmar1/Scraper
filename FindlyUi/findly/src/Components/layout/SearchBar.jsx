import { Search } from "lucide-react";

export default function SearchBar({ query, setQuery, loading, onSearch }) {
  return (
    <div className="max-w-3xl mx-auto flex items-center gap-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
      <Search className="text-blue-300" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search iPhone, laptop..."
        className="w-full bg-transparent outline-none text-white text-lg"
      />

      <button
        onClick={onSearch}
        className="cursor-pointer px-6 py-2 bg-blue-500 hover:bg-blue-400 rounded-xl transition font-semibold"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
