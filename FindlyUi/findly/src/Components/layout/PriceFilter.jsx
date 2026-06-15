export default function PriceFilter({ min, max, setMin, setMax, visible }) {
  if (!visible) return null;

  return (
    <div className="max-w-4xl mx-auto mt-6 flex gap-4 justify-center">
      <input
        type="number"
        placeholder="Min Price"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/10 border border-white/10"
      />

      <input
        type="number"
        placeholder="Max Price"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/10 border border-white/10"
      />
    </div>
  );
}
