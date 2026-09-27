"use client";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";
import { useOutfit } from "@/lib/store";

export default function TryOnActions({ id, url }: { id: string; url: string }) {
  const addItem = useOutfit((s) => s.addItem);
  const add = () => {
    const p = MOCK_PRODUCTS.find((x) => x.id === id);
    if (p) { addItem(p); alert("Added to outfit"); }
  };
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button onClick={add} className="btn-ghost">Add to Outfit</button>
      <Link href={`/try-on?add=${id}`} className="btn-primary">Try This On</Link>
      <a href={url} target="_blank" rel="nofollow sponsored noopener" className="btn-accent">Buy from Retailer</a>
    </div>
  );
}
