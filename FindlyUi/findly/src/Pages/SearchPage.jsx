import { useState } from "react";
import { Search } from "lucide-react";
function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/products/search?q=${query}`,
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to search products");
      }
      setResults(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white px-6 py-40">
      <h1 className="text-4xl font-bold text-center mb-10">
        Search anything instantly
      </h1>
      <div className="max-w-2xl mx-auto flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
        <Search className="text-blue-300" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products (e.g. iPhone, laptop...)"
          className="w-full bg-transparent outline-none text-white"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-xl hover:cursor-pointer transition"
        >
          Search
        </button>
      </div>
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition"
          >
            <img
              src={item.image}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />

            <h2 className="text-lg font-bold">{item.title}</h2>

            <div className="flex justify-between text-sm text-white/70 mt-2">
              <span>${item.price}</span>
              <span>⭐ {item.rating}</span>
            </div>

            <p className="text-xs text-blue-300 mt-2">{item.source}</p>

            <button className="mt-4 w-full bg-blue-500 hover:bg-blue-400 py-2 rounded-xl hover:cursor-pointer transition">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                View Deal
              </a>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
