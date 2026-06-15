import { useState } from "react";

import SearchBar from "../components/layout/SearchBar";
import PriceFilter from "../components/layout/PriceFilter";
import SortBar from "../components/layout/SortBar";
import ProductCard from "../components/layout/ProductCard";

import { useProducts } from "../hooks/useProducts";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("");

  const { products, loading, hasSearched, search } = useProducts(
    query,
    min,
    max,
    sort,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white px-6 py-20">
      <h1 className="text-5xl font-bold text-center mb-10">Findly 🔍</h1>

      <SearchBar
        query={query}
        setQuery={setQuery}
        loading={loading}
        onSearch={search}
      />

      <PriceFilter
        min={min}
        max={max}
        setMin={setMin}
        setMax={setMax}
        visible={!hasSearched}
      />

      <SortBar sort={sort} setSort={setSort} visible={hasSearched} />

      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        {products.map((item, i) => (
          <ProductCard key={i} item={item} />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <p className="text-center mt-10 text-white/50">
          No results yet. Try searching something 🚀
        </p>
      )}
    </div>
  );
}

export default SearchPage;
