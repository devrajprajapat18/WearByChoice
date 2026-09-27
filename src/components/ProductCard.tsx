"use client";
import Link from "next/link";
import type { Product } from "@/types";
import SafeImage from "./SafeImage";
import { useOutfit, useWishlist } from "@/lib/store";
import { formatINR } from "@/lib/format";

function badgeFor(p: Product): { label: string; cls: string } | null {
  if (p.id === "wbc-tee-black-crew") return { label: "Bestseller", cls: "bg-black/10 text-black/70" };
  if (p.id === "wbc-tee-white-polo") return { label: "Popular", cls: "bg-rose-200/80 text-rose-700" };
  if (p.id === "wbc-tee-light-blue-crew") return { label: "New", cls: "bg-indigo-200/80 text-indigo-700" };
  if (p.id === "wbc-tee-chocolate-brown-crew") return { label: "Trending", cls: "bg-amber-300/90 text-amber-900" };
  if (p.popularity >= 92) return { label: "Trending", cls: "bg-amber-300/90 text-amber-900" };
  if (p.popularity >= 88) return { label: "New", cls: "bg-indigo-200/80 text-indigo-700" };
  return null;
}

export function ProductCard({ p }: { p: Product }) {
  const addItem = useOutfit((s) => s.addItem);
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(p.id);
  const badge = badgeFor(p);
  return (
    <article className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
      <div className="relative bg-[#f1f2f4]">
        {badge && (
          <span className={`absolute left-3 top-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        <button
          onClick={() => toggle(p.id)}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 h-8 w-8 inline-flex items-center justify-center rounded-full bg-white shadow-sm border border-black/5 hover:scale-105 transition"
        >
          {saved ? "♥" : "♡"}
        </button>
        <Link href={`/products/${p.slug}`}>
          <SafeImage src={p.thumbnail} alt={p.name} seed={p.id} className="w-full aspect-square object-cover" />
        </Link>
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-wider text-black/45">{p.brand}</p>
        <Link href={`/products/${p.slug}`} className="text-[13px] font-semibold leading-snug hover:underline line-clamp-1">{p.name}</Link>
        <p className="mt-1 text-sm font-bold">
          {formatINR(p.price)}{" "}
          {p.originalPrice && <span className="text-black/35 line-through font-normal text-xs">{formatINR(p.originalPrice)}</span>}{" "}
          {p.discount ? <span className="text-green-700 text-xs font-semibold">{p.discount}% off</span> : null}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link href={`/try-on?add=${p.id}`} className="rounded-full bg-ink text-white text-xs font-semibold text-center py-2 hover:opacity-90 transition">Try On</Link>
          <button onClick={() => addItem(p)} className="rounded-full border border-black/15 text-xs font-semibold py-2 hover:bg-black/5 transition">Add</button>
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-busy="true">
      {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-square" />)}
    </div>
  );
}
