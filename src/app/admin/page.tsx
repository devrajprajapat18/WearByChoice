"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState<{ products: number; brands: number; categories: number; provider: string } | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/products").then((r) => r.json()).then((d) => setStats({ products: d.total, brands: d.brands.length, categories: d.categories.length, provider: "mock" })); }, []);
  const sync = async () => {
    setMsg("Syncing…");
    const r = await fetch("/api/admin/products/sync", { method: "POST" });
    const d = await r.json();
    setMsg(r.ok ? `Synced ${d.synced} products, removed ${d.duplicatesRemoved} duplicates` : d.error ?? "Sync failed");
  };
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-3 mt-6">
        {[["Total Products", stats?.products ?? "…"], ["Brands", stats?.brands ?? "…"], ["Categories", stats?.categories ?? "…"], ["Provider", stats?.provider ?? "…"]].map(([k, v]) => (
          <div key={k} className="card p-5"><p className="text-xs text-black/50">{k}</p><p className="text-2xl font-black">{v}</p></div>
        ))}
      </div>
      <div className="card p-5 mt-6">
        <p className="font-bold">Product sync</p>
        <p className="text-sm text-black/60">Fetch → normalize → dedupe → store. Uses provider adapters; secrets stay server-side.</p>
        <button onClick={sync} className="btn-primary mt-3">Sync products</button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>
    </div>
  );
}
