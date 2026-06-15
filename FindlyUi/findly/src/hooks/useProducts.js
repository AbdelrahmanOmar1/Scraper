import { useEffect, useState } from "react";

export function useProducts(query, min, max, sort) {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = async () => {
    if (!query) return;

    setLoading(true);

    try {
      await fetch(
        `http://localhost:8000/api/v1/findly?q=${query}&source=amazon,noon&min=${min}&max=${max}`,
      );

      const res = await fetch(
        `http://localhost:8000/api/v1/products?q=${query}`,
      );

      const data = await res.json();

      const result = data.results || [];

      setAllProducts(result);
      setProducts(result);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!hasSearched) return;

    let data = [...allProducts];

    const parsePrice = (p) =>
      Number((p.price || "").replace(/[^\d]/g, "")) || 0;

    if (sort === "price_asc") {
      data.sort((a, b) => parsePrice(a) - parsePrice(b));
    }

    if (sort === "price_desc") {
      data.sort((a, b) => parsePrice(b) - parsePrice(a));
    }

    setProducts(data);
  }, [sort, allProducts, hasSearched]);

  return {
    products,
    loading,
    hasSearched,
    search,
  };
}
