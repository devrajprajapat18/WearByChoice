"use client";
import { useState } from "react";
import Link from "next/link";
import { useOutfit } from "@/lib/store";
import { formatINR } from "@/lib/format";

export default function OutfitPage() {
  const { items, removeItem, clear } = useOutfit();
  const [name, setName] = useState("My Outfit");
  const [msg, setMsg] = useState("");
  const total = items.reduce((s, p) => s + p.price, 0);

  const save = () => {
    const saved = JSON.parse(localStorage.getItem("wbc-outfits") ?? "[]");
    saved.push({ name, items: items.map((i) => i.id), createdAt: new Date().toISOString() });
    localStorage.setItem("wbc-outfits", JSON.stringify(saved));
    setMsg(`Saved "${name}"`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black">Outfit Builder</h1>
      <p className="text-black/60 mt-1">Top → Bottom → Shoes → Watch → Accessories</p>
      {items.length === 0 ? (
        <div className="card p-10 text-center mt-6">No items yet. <Link href="/discover" className="underline">Discover products</Link> and add them here.</div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          {items.map((p) => (
            <div key={p.id} className="card p-3 flex gap-3 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.thumbnail} alt={p.name} className="w-16 h-20 object-cover rounded-xl" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-xs text-black/50">{p.brand} · {formatINR(p.price)}</p>
              </div>
              <Link href={`/discover?category=${encodeURIComponent(p.category)}`} className="btn-ghost text-xs">Replace</Link>
              <button onClick={() => removeItem(p.id)} className="btn-ghost text-xs" aria-label={`Remove ${p.name}`}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="card p-5 mt-6 flex flex-col md:flex-row gap-3 items-center">
        <p className="font-bold">Total: {formatINR(total)}</p>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input md:w-64" aria-label="Outfit name" />
        <button onClick={save} disabled={!items.length} className="btn-ghost">Save Look</button>
        <button onClick={clear} className="btn-ghost">Clear</button>
        <Link href="/try-on" className="btn-accent">Continue to Try On →</Link>
      </div>
      {msg && <p className="mt-3 text-green-700">{msg}</p>}
    </div>
  );
}
