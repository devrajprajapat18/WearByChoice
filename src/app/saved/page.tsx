"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/store";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";
import { ProductCard } from "@/components/ProductCard";

export default function SavedPage() {
  const { ids } = useWishlist();
  const [outfits, setOutfits] = useState<{ name: string; items: string[]; createdAt: string }[]>([]);
  useEffect(() => {
    try { setOutfits(JSON.parse(localStorage.getItem("wbc-outfits") ?? "[]")); } catch { /* ignore */ }
  }, []);
  const saved = MOCK_PRODUCTS.filter((p) => ids.includes(p.id));
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black">Saved</h1>
      <h2 className="font-bold mt-6">Wishlist ({saved.length})</h2>
      {saved.length === 0 ? <p className="text-sm text-black/50 mt-2">Nothing saved yet.</p> :
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">{saved.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      <h2 className="font-bold mt-8">Saved outfits ({outfits.length})</h2>
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        {outfits.map((o, i) => (
          <div key={i} className="card p-5">
            <p className="font-bold">{o.name}</p>
            <ul className="text-sm text-black/60 mt-1">{o.items.map((id) => <li key={id}>· {MOCK_PRODUCTS.find((p) => p.id === id)?.name ?? id}</li>)}</ul>
            <Link href="/try-on" className="btn-ghost text-xs mt-3 inline-block">Regenerate</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
