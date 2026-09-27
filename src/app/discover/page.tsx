"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import { ProductCard, ProductGridSkeleton } from "@/components/ProductCard";

const CATS = ["", "T-Shirts", "Shirts", "Tops", "Jeans", "Trousers", "Cargo", "Shorts", "Jackets", "Hoodies", "Sweaters", "Dresses", "Kurtas", "Sarees", "Shoes", "Sneakers", "Boots", "Watches", "Bags", "Sunglasses", "Caps", "Accessories"];

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><ProductGridSkeleton /></div>}>
      <DiscoverInner />
    </Suspense>
  );
}

function DiscoverInner() {
  const params = useSearchParams();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [gender, setGender] = useState("");
  const [sort, setSort] = useState("popular");
  const [maxPrice, setMaxPrice] = useState("");

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (gender) sp.set("gender", gender);
    if (sort) sp.set("sort", sort);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    return sp.toString();
  }, [q, category, gender, sort, maxPrice]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/search?${query}`).then((r) => r.json()).then((d) => { setItems(d.products ?? []); setLoading(false); }).catch(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black">Discover fashion</h1>
      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search black oversized shirt…" className="input" aria-label="Search" />
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="input md:w-44" aria-label="Gender">
          <option value="">All genders</option><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input md:w-44" aria-label="Sort">
          <option value="popular">Popular</option><option value="price-asc">Price low→high</option><option value="price-desc">Price high→low</option><option value="rating">Top rated</option><option value="newest">Newest</option>
        </select>
        <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ₹" inputMode="numeric" className="input md:w-32" aria-label="Max price" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {CATS.map((c) => <button key={c} onClick={() => setCategory(c)} className={`chip ${category === c ? "chip-active" : ""}`}>{c || "All"}</button>)}
      </div>
      <p className="text-sm text-black/50 mt-4">{loading ? "Loading…" : `${items.length} products`}</p>
      <div className="mt-4">{loading ? <ProductGridSkeleton /> : items.length === 0 ? <div className="card p-10 text-center">No products found. Try another search.</div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>}</div>
    </div>
  );
}
