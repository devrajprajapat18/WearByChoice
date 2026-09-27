"use client";
import { useState } from "react";
import Link from "next/link";
import { useOutfit } from "@/lib/store";
import { formatINR } from "@/lib/format";

const CATS = [
  { name: "Tops", desc: "T-Shirts, Shirts, Hoodies", img: "/products/beige-crew-tee.jpg", pos: "50% 30%", href: "/discover?category=T-Shirts" },
  { name: "Bottoms", desc: "Jeans, Trousers, Shorts", img: "/hero/hero-main-beige-overshirt.png", pos: "50% 62%", href: "/discover" },
  { name: "Shoes", desc: "Sneakers, Formal, Casual", img: "/hero/hero-main-beige-overshirt.png", pos: "50% 100%", href: "/discover" },
  { name: "Watches", desc: "Classic, Modern, Smart", img: "/hero/hero-blue-colorblock.png", pos: "15% 55%", href: "/discover" },
  { name: "Accessories", desc: "Caps, Bags, Sunglasses & more", img: "/outfits/outfit-casual-college-fit.jpeg", pos: "85% 12%", href: "/discover" },
];

const PERKS = [
  { icon: "/icons/icons8-choose-50.png", title: "Mix & Match", sub: "From top brands" },
  { icon: "/icons/icons8-ai-32.png", title: "AI Try-On", sub: "See it on you" },
  { icon: "/icons/icons8-share-80.png", title: "Save Your Looks", sub: "Build your collection" },
];

const STEPS = [
  { n: "01", icon: "/icons/icons8-shopping-bag-64.png", title: "Choose items", text: "Pick tops, bottoms, shoes, watches & accessories" },
  { n: "02", icon: "/icons/icons8-jumper-80.png", title: "Build your outfit", text: "Mix and match pieces to create your look" },
  { n: "03", icon: "/icons/icons8-take-off-48.png", title: "Try it on", text: "See how it looks on you with AI" },
];

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
    <div className="bg-[#fbfaf8]">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-[#111]">Outfit Builder</h1>
            <p className="text-sm text-black/50 mt-1">Top → Bottom → Shoes → Watch → Accessories</p>
          </div>
          <div className="flex items-center gap-3 rounded-[18px] bg-[#eef3e2] border border-black/[0.05] px-5 py-3.5">
            <span className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-white p-2">
              <img src="/icons/icons8-jumper-80.png" alt="" className="h-5 w-5 object-contain" />
            </span>
            <span>
              <b className="block text-[13px] text-[#111]">Create your style</b>
              <span className="block text-[11.5px] text-black/50">Mix, match and try on with AI</span>
            </span>
          </div>
        </div>

        {/* Builder canvas */}
        <div className="mt-5 rounded-[22px] bg-[#f4f6ec] border border-black/[0.05] px-6 md:px-10 py-8 md:py-10 grid lg:grid-cols-2 gap-8 items-center overflow-hidden">
          {/* Visual / slots (empty space left intentionally where art is missing) */}
          <div className="relative min-h-[300px] md:min-h-[360px] rounded-[18px] bg-[radial-gradient(ellipse_at_center,#e9edda_0%,transparent_65%)] flex items-center justify-center">
            <span className="absolute left-2 top-4 text-[13px] font-bold italic leading-tight text-black/70 -rotate-6">Mix<br />Match<br />Explore <span className="text-[#9ccf2e]">↗</span></span>
            <span className="absolute right-2 top-10 text-[13px] font-bold italic leading-tight text-right text-black/70 rotate-3">Your<br />Style<br />Your Way <span className="text-[#9ccf2e]">↙</span></span>
            {items.length === 0 ? (
              <div className="flex flex-wrap items-end justify-center gap-3 max-w-[380px]" aria-hidden="true">
                {["Top", "Bottom", "Shoes", "Watch", "Accessory"].map((s) => (
                  <span key={s} className="flex h-24 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-white/50 text-[11px] font-semibold text-black/35">{s}</span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-end justify-center gap-3 max-w-[420px]">
                {items.map((p) => (
                  <span key={p.id} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.thumbnail} alt={p.name} className="h-28 w-24 rounded-2xl object-cover bg-white shadow-sm border border-black/[0.06]" />
                    <button onClick={() => removeItem(p.id)} aria-label={`Remove ${p.name}`} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#111] text-white text-xs leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Copy + actions */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase bg-white border border-black/[0.06] rounded-full px-3 py-1.5 text-black/60">
              ◍ {items.length === 0 ? "EMPTY OUTFIT" : `${items.length} ITEM${items.length > 1 ? "S" : ""} SELECTED`}
            </span>
            <h2 className="mt-3 text-[30px] md:text-[34px] font-black tracking-tight text-[#111]">Build your perfect look</h2>
            <p className="text-sm text-black/55 mt-1.5">
              {items.length === 0 ? "Start by adding pieces from our catalog." : `Total ${formatINR(total)} — ready for AI try-on, or keep mixing.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/discover" className="h-12 inline-flex items-center rounded-full bg-[#c9f158] text-[#111] text-sm font-bold px-7 hover:brightness-[0.96] transition">Discover Products →</Link>
              {items.length > 0 && (
                <Link href="/try-on" className="h-12 inline-flex items-center rounded-full bg-[#111] text-white text-sm font-semibold px-7 hover:opacity-90 transition">Preview Try-On →</Link>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {PERKS.map((f) => (
                <div key={f.title} className="flex items-center gap-2.5">
                  <span className="h-10 w-10 inline-flex items-center justify-center rounded-2xl bg-white border border-black/[0.07] p-2">
                    <img src={f.icon} alt="" loading="lazy" className="h-5 w-5 object-contain" />
                  </span>
                  <span>
                    <b className="block text-[12.5px] text-[#111]">{f.title}</b>
                    <span className="block text-[11.5px] text-black/50">{f.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chosen items (functional list) */}
        {items.length > 0 && (
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {items.map((p) => (
              <div key={p.id} className="card p-3 flex gap-3 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumbnail} alt={p.name} className="w-16 h-20 object-cover rounded-xl bg-[#f1f2f4]" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-xs text-black/50">{p.brand} · {formatINR(p.price)}</p>
                </div>
                <Link href={`/discover?category=${encodeURIComponent(p.category)}`} className="rounded-full border border-black/15 text-xs font-semibold px-4 h-9 inline-flex items-center hover:bg-black/5 transition">Replace</Link>
                <button onClick={() => removeItem(p.id)} className="rounded-full border border-black/15 text-xs font-semibold px-4 h-9 hover:bg-black/5 transition" aria-label={`Remove ${p.name}`}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {/* Category cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATS.map((c) => (
            <div key={c.name} className="card p-3.5 flex gap-3 items-center">
              <span className="block h-[86px] w-[68px] shrink-0 rounded-2xl overflow-hidden bg-[#f1f2f4] border border-black/[0.05]">
                <img src={c.img} alt={c.name} loading="lazy" style={{ objectPosition: c.pos }} className="h-full w-full object-cover" />
              </span>
              <span className="min-w-0">
                <b className="block text-[13.5px] text-[#111]">{c.name}</b>
                <span className="block text-[11px] text-black/50 leading-snug mt-0.5">{c.desc}</span>
                <Link href={c.href} className="mt-2 inline-flex items-center h-8 rounded-full border border-black/15 text-[11.5px] font-bold px-3.5 hover:bg-[#111] hover:text-white transition">Browse →</Link>
              </span>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-4 rounded-[22px] bg-[#eef3e2] border border-black/[0.05] px-6 md:px-8 py-6 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="shrink-0">
            <h2 className="text-[19px] font-extrabold text-[#111]">How it works</h2>
            <p className="text-xs text-black/55 mt-0.5">Create your outfit in 3 simple steps.</p>
          </div>
          <div className="flex-1 grid sm:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative flex gap-3 items-start">
                <span className="h-8 w-8 shrink-0 inline-flex items-center justify-center rounded-full bg-[#dce8b8] text-[11px] font-black text-[#3f6212]">{s.n}</span>
                <span className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-2xl bg-white border border-black/[0.07] p-2">
                  <img src={s.icon} alt="" loading="lazy" className="h-5 w-5 object-contain" />
                </span>
                <span>
                  <b className="block text-[13px] text-[#111]">{s.title}</b>
                  <span className="block text-[11.5px] text-black/55 leading-snug mt-0.5">{s.text}</span>
                </span>
                {i < STEPS.length - 1 && <span aria-hidden="true" className="hidden sm:block absolute top-4 -right-3 text-black/20">›</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Total bar */}
        <div className="mt-4 card px-5 py-4 flex flex-col lg:flex-row gap-3 lg:items-center">
          <p className="font-extrabold text-[17px] shrink-0">Total: {formatINR(total)}</p>
          <label className="flex-1 flex items-center gap-2.5 rounded-full border border-black/10 px-4 bg-white">
            <span aria-hidden="true" className="text-black/40">✎</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm h-11" aria-label="Outfit name" placeholder="My Outfit" />
          </label>
          <div className="flex flex-wrap gap-2.5">
            <button onClick={save} disabled={!items.length} className="h-11 inline-flex items-center rounded-full border border-black/15 text-[13px] font-bold px-5 hover:bg-black/5 transition disabled:opacity-40">🔖 Save Look</button>
            <button onClick={clear} className="h-11 inline-flex items-center rounded-full border border-black/15 text-[13px] font-bold px-5 hover:bg-black/5 transition">🗑 Clear</button>
            <Link href="/try-on" className="h-11 inline-flex items-center rounded-full bg-[#c9f158] text-[#111] text-[13px] font-bold px-6 hover:brightness-[0.96] transition">Continue to Try On →</Link>
          </div>
        </div>
        {msg && <p className="mt-3 text-sm text-green-700 font-semibold">{msg}</p>}
      </div>
    </div>
  );
}
