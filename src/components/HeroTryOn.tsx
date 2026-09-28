"use client";
import { useState } from "react";

const LOOKS = [
  {
    id: "green-check",
    label: "Green Check",
    jacketImg: "/products/green-black-check-flannel-shirt.jpg",
    jacketAlt: "Green black check flannel shirt",
    modelImg: "/hero/tryon-green-check-flannel.png",
    modelAlt: "Full-body model wearing green check flannel shirt, black jeans and white sneakers",
  },
  {
    id: "rose-tribal",
    label: "Rose Tribal",
    jacketImg: "/products/cream-rose-tribal-hooded-tee.jpeg",
    jacketAlt: "Cream rose tribal short-sleeve hoodie",
    modelImg: "/hero/tryon-rose-tribal-hoodie.png",
    modelAlt: "Full-body model wearing cream rose tribal hoodie, black jeans and white sneakers",
  },
  {
    id: "black-tribal",
    label: "Black Tribal",
    jacketImg: "/products/black-tribal-pocket-hoodie.jpeg",
    jacketAlt: "Black tribal pocket hoodie",
    modelImg: "/hero/tryon-black-tribal-hoodie.png",
    modelAlt: "Full-body model wearing black tribal pocket hoodie, black jeans and white sneakers",
  },
  {
    id: "stripe",
    label: "Stripe Hoodie",
    jacketImg: "/products/white-forest-green-stripe-hoodie.jpeg",
    jacketAlt: "White hoodie with green hood and yellow stripes",
    modelImg: "/hero/tryon-stripe-hoodie.png",
    modelAlt: "Full-body model wearing white stripe hoodie, black jeans and white sneakers",
  },
  {
    id: "mocha",
    label: "Mocha Hoodie",
    jacketImg: "/products/mocha-brown-tribal-hoodie.jpeg",
    jacketAlt: "Mocha brown two-tone hoodie",
    modelImg: "/hero/tryon-mocha-hoodie.png",
    modelAlt: "Full-body model wearing mocha brown hoodie, black jeans and white sneakers",
  },
  {
    id: "sunset-furry",
    label: "Sunset Furry",
    jacketImg: "/products/white-orange-sunset-furry-hoodie.jpeg",
    jacketAlt: "White orange sunset furry hoodie",
    modelImg: "/hero/tryon-sunset-furry.png",
    modelAlt: "Full-body model wearing orange sunset furry hoodie, black jeans and white sneakers",
  },
  {
    id: "olive-overshirt",
    label: "Olive Overshirt",
    jacketImg: "/products/category-olive-shirt-jacket.jpeg",
    jacketAlt: "Olive shirt jacket over white tee",
    modelImg: "/hero/tryon-beige-overshirt.png",
    modelAlt: "Full-body model wearing overshirt over white tee, black jeans and white sneakers",
  },
  {
    id: "tribal-trucker",
    label: "Tribal Trucker",
    jacketImg: "/products/cream-tribal-trucker-jacket.jpeg",
    jacketAlt: "Cream tribal trucker jacket",
    modelImg: "/hero/tryon-tribal-trucker.png",
    modelAlt: "Full-body model wearing cream tribal trucker jacket, black jeans and white sneakers",
  },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

export function HeroTryOn() {
  const [selected, setSelected] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const look = LOOKS[selected];

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)));
  const rotate = () => setRotation((r) => (r + 90) % 360);
  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="relative mx-auto w-full max-w-[620px] md:max-w-[560px] select-none" aria-label="Interactive virtual try-on">
      {/* handwritten callout */}
      <div className="absolute -top-2 right-[1%] rotate-[6deg] text-right z-10 hidden sm:block">
        <p className="text-[13px] md:text-[14px] font-bold italic leading-tight text-black/70">
          Try different styles<br />instantly
        </p>
        <svg aria-hidden="true" className="ml-auto mt-1 w-10 h-12 text-black/70" viewBox="0 0 40 48" fill="none">
          <path d="M30 4c6 8 6 20-4 30-5 5-12 8-18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 34l-4 8 9-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-4 md:gap-5 pt-14 sm:pt-16">
        {/* Left: 2x4 jacket grid */}
        <div className="shrink-0 w-full md:w-auto">
          <p className="text-[12px] md:text-[13px] font-extrabold uppercase tracking-[0.14em] text-black/70">Jackets & Hoodies</p>
          <p className="text-[11.5px] text-black/50 mt-0.5 mb-3">Choose a style to try on</p>
          <div className="grid grid-cols-4 md:grid-cols-2 gap-2.5 md:gap-3" role="radiogroup" aria-label="Choose a jacket or hoodie">
            {LOOKS.map((l, i) => {
              const active = i === selected;
              return (
                <button
                  key={l.id}
                  role="radio"
                  aria-checked={active}
                  aria-label={`Show ${l.label} on model`}
                  onClick={() => setSelected(i)}
                  className={`relative w-full md:w-[92px] aspect-[3/4] rounded-[20px] overflow-hidden bg-[#e8e2d3] transition hover:scale-[1.04] ${
                    active
                      ? "ring-2 ring-[#4d8d1f] ring-offset-2 ring-offset-[#f2f4ea] shadow-[0_12px_28px_-12px_rgba(77,141,31,0.55)] scale-[1.03]"
                      : "ring-1 ring-black/10 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.4)]"
                  }`}
                >
                  <img src={l.jacketImg} alt={l.jacketAlt} loading="lazy" className="h-full w-full object-cover" />
                  {active && (
                    <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 h-6 w-6 inline-flex items-center justify-center rounded-full bg-[#4d8d1f] text-white text-[13px] font-bold shadow">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: large full-body model card, same height as the options column on desktop */}
        <div className="relative w-full md:w-[324px] md:flex md:self-stretch">
          <div className="relative flex-1 overflow-hidden rounded-[28px] bg-[#e8e2d3] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.35)]">
            <img
              key={look.id}
              src={look.modelImg}
              alt={look.modelAlt}
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              className="hero-look-enter w-full aspect-[3/4] md:aspect-auto md:absolute md:inset-0 md:h-full object-cover transition-transform duration-300"
            />
            <span key={`label-${look.id}`} className="hero-look-enter absolute top-3.5 left-3.5 inline-flex items-center bg-[#1c1c1c]/90 text-white rounded-full px-4 py-2 text-[12.5px] font-bold">
              {look.label}
            </span>
            <button
              onClick={rotate}
              aria-label="Rotate model photo"
              className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 bg-white rounded-full pl-3 pr-4 py-2 text-[12.5px] font-bold text-black/80 shadow hover:bg-black/[0.04] transition"
            >
              <span aria-hidden="true" className="text-[14px]">⟳</span> Rotate
            </button>
            <div className="absolute bottom-3.5 right-3.5 flex flex-col rounded-full bg-white shadow overflow-hidden" role="group" aria-label="Zoom controls">
              <button onClick={zoomIn} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" className="w-9 h-9 inline-flex items-center justify-center text-lg font-bold text-black/80 hover:bg-black/5 transition disabled:opacity-30">+</button>
              <span aria-hidden="true" className="h-px bg-black/10 mx-2" />
              <button onClick={zoomOut} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out" className="w-9 h-9 inline-flex items-center justify-center text-lg font-bold text-black/80 hover:bg-black/5 transition disabled:opacity-30">−</button>
              <span aria-hidden="true" className="h-px bg-black/10 mx-2" />
              <button onClick={resetView} aria-label="Reset view" className="w-9 h-9 inline-flex items-center justify-center text-[15px] text-black/80 hover:bg-black/5 transition">⟲</button>
            </div>
            <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3.5 py-1.5 text-xs font-bold shadow">
              <span className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-[#111] text-white text-[10px]">◍</span> Your Photo
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[12.5px] text-black/50">Tap a jacket to see it on the model 👆</p>
    </div>
  );
}
