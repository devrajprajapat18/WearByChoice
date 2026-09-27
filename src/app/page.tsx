import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";
import { ProductCard } from "@/components/ProductCard";

const HERO_THUMBS = [
  { src: "/hero/hero-blue-colorblock.png", alt: "Sky blue colorblock hoodie on model" },
  { src: "/hero/hero-tribal-jacket.png", alt: "Cream tribal trucker jacket on model" },
  { src: "/hero/hero-orange-furry.png", alt: "Orange sunset furry hoodie on model" },
  { src: "/hero/hero-panda-tee.png", alt: "Grey panda graphic tee on model" },
];

const CATEGORIES = [
  { name: "T-Shirts", img: "/products/black-crew-tee.jpg", pos: "50% 30%" },
  { name: "Shirts", img: "/products/teal-blue-white-check-shirt.jpg", pos: "50% 20%" },
  { name: "Hoodies", img: "/products/tan-pullover-hoodie.jpg", pos: "50% 20%" },
  { name: "Jackets", img: "/products/tan-brown-denim-trucker-jacket.jpg", pos: "50% 20%" },
  // Real on-model crops so no category is an empty placeholder
  { name: "Jeans", img: "/hero/hero-main-beige-overshirt.png", pos: "50% 62%" },
  { name: "Sneakers", img: "/hero/hero-main-beige-overshirt.png", pos: "50% 100%" },
  { name: "Watches", img: "/hero/hero-blue-colorblock.png", pos: "15% 55%" },
  { name: "Accessories", img: "/hero/hero-blue-colorblock.png", pos: "50% 0%" },
];

const OUTFITS = [
  {
    titleA: "Casual",
    titleB: "College Fit",
    bg: "bg-[#edf2e3]",
    items: ["Olive Overshirt + White Tee", "Black Straight-Fit Jeans", "White Court Sneakers"],
    img: "/outfits/outfit-casual-college-fit.jpeg",
  },
  {
    titleA: "Festive",
    titleB: "Kurta Look",
    bg: "bg-[#faf0da]",
    items: ["Navy Embroidered Kurta", "White Drawstring Pajama", "Minimal Festive Footwear"],
    img: "/outfits/outfit-festive-kurta.jpeg",
  },
  {
    titleA: "Smart Casual",
    titleB: "Edit",
    bg: "bg-[#eceff5]",
    items: ["Maroon Overshirt + White Tee", "Grey Slim-Fit Jeans", "White Sneakers + Black Watch"],
    img: "/outfits/outfit-smart-casual.jpeg",
  },
];

const STEPS = [
  { n: "01", title: "Choose", text: "Pick tops, bottoms, shoes & accessories", icon: "/icons/icons8-choose-50.png" },
  { n: "02", title: "Upload", text: "Upload a clear full-body photo", icon: "/icons/icons8-upload-24.png" },
  { n: "03", title: "Try On", text: "AI visualizes the outfit on you", icon: "/icons/icons8-take-off-48.png" },
  { n: "04", title: "Shop", text: "Buy directly from the retailer", icon: "/icons/icons8-shopping-bag-64.png" },
];

export default function Home() {
  const trending = [...MOCK_PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  return (
    <div className="bg-[#fbfaf8]">
      {/* ================= HERO ================= */}
      <section className="bg-[#eff1e6] border-b border-black/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase bg-[#e4e9d2] text-[#3f6212] rounded-full px-3.5 py-1.5">
              ✦ AI VIRTUAL TRY-ON
            </span>
            <h1 className="mt-5 text-[52px] md:text-[68px] font-black tracking-[-0.03em] leading-[1.0] text-[#111]">
              Wear it before<br />
              <span className="text-[#4d8d1f]">you buy it.</span>
            </h1>
            <p className="mt-4 text-[15.5px] leading-relaxed text-black/60 max-w-[440px]">
              Upload your photo, explore styles, and see how outfits look on you — powered by AI.
            </p>
            <form action="/discover" method="get" role="search" className="mt-6 flex gap-2.5 max-w-[480px]">
              <label className="flex-1 flex items-center gap-2.5 bg-white rounded-full border border-black/10 pl-4 pr-1.5 py-1.5 focus-within:border-black/30 transition">
                <span aria-hidden="true" className="text-black/35 text-[15px]">⧉</span>
                <input name="q" placeholder="Try &quot;black oversized shirt&quot;..." aria-label="Search products" className="w-full bg-transparent outline-none text-sm h-9 placeholder:text-black/35" />
              </label>
              <button className="h-12 rounded-full bg-[#111] text-white text-sm font-semibold px-8 hover:opacity-90 transition shrink-0" type="submit">Search</button>
            </form>
            <div className="mt-4 flex gap-3">
              <Link href="/try-on" className="h-12 inline-flex items-center rounded-full bg-[#c9f158] text-[#111] text-sm font-bold px-7 hover:brightness-[0.96] transition">Try It On →</Link>
              <Link href="/discover" className="h-12 inline-flex items-center rounded-full bg-white border border-black/10 text-sm font-semibold px-7 hover:bg-black/[0.04] transition">Explore Fashion</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {[
                ["AI Powered", "Virtual Try-On", "/icons/icons8-ai-32.png"],
                ["Real Clothing", "from Top Brands", "/icons/icons8-jumper-80.png"],
                ["Save & Share", "Your Looks", "/icons/icons8-share-80.png"],
              ].map(([b, s, icon]) => (
                <div key={b} className="flex items-center gap-2.5">
                  <span className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white border border-black/[0.07] p-1.5" aria-hidden="true">
                    <img src={icon} alt="" loading="lazy" className="h-5 w-5 object-contain" />
                  </span>
                  <span>
                    <b className="block text-[12.5px] leading-tight text-[#111]">{b}</b>
                    <span className="block text-[11.5px] text-black/50">{s}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual: 1 main + 4 thumbs */}
          <div className="flex items-start justify-center gap-4">
            <div className="relative shrink-0">
              <img
                src="/hero/hero-main-beige-overshirt.png"
                alt="Full-body model wearing beige overshirt, white tee and black jeans"
                className="w-[300px] xl:w-[330px] aspect-[3/4] object-cover rounded-[22px] bg-[#e3e0d3] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
              />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3.5 py-1.5 text-xs font-bold shadow-lg">
                <span className="h-5 w-5 inline-flex items-center justify-center rounded-full bg-[#111] text-white text-[10px]">◍</span> Your Photo
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3.5 pt-2">
              {HERO_THUMBS.map((t) => (
                <img
                  key={t.src}
                  src={t.src}
                  alt={t.alt}
                  loading="lazy"
                  className="w-[112px] aspect-[3/4] object-cover rounded-[18px] bg-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)] border border-black/[0.05]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRENDING PRODUCTS ================= */}
      <section className="max-w-[1280px] mx-auto px-6 mt-8">
        <p className="eyebrow">Trending Now</p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight text-[#111]">Trending Products</h2>
            <p className="text-sm text-black/55 mt-0.5">Most loved picks, customized for your style.</p>
          </div>
          <Link href="/discover" className="text-xs font-bold hover:underline shrink-0">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5 items-stretch">
          {trending.map((p) => (
            <div key={p.id} className="h-full [&>article]:h-full">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-[1280px] mx-auto px-6 mt-8">
        <div className="rounded-[22px] bg-[#131313] text-white px-7 md:px-10 py-9 md:py-10 grid lg:grid-cols-[1.45fr_1fr] gap-10 items-center overflow-hidden">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#c9f158]">✦ How it works</p>
            <h2 className="mt-2 text-[26px] md:text-[30px] font-extrabold tracking-tight">
              Build your look in <span className="text-[#c9f158]">4 simple steps</span>
            </h2>
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STEPS.map((s) => (
                <div key={s.n}>
                  <span className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white p-2" aria-hidden="true">
                    <img src={s.icon} alt="" loading="lazy" className="h-6 w-6 object-contain" />
                  </span>
                  <p className="mt-3 text-[13px] font-bold"><span className="text-white/40 font-semibold mr-1.5">{s.n}</span>{s.title}</p>
                  <p className="text-[11.5px] leading-snug text-white/55 mt-1 max-w-[150px]">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <figure className="text-center">
              <img src="/hero/hero-panda-tee.png" alt="Before: person in normal clothes" loading="lazy" className="w-[140px] xl:w-[155px] aspect-[3/4] object-cover rounded-[18px] bg-[#2a2a2a]" />
              <figcaption className="text-[10.5px] text-white/45 mt-2 font-medium">Before</figcaption>
            </figure>
            <div className="flex flex-col items-center gap-1 px-1">
              <span className="text-[10px] font-bold text-[#c9f158] leading-tight text-center">AI<br />Try-On</span>
              <span aria-hidden="true" className="text-[#c9f158] text-[26px] leading-none">→</span>
            </div>
            <figure className="text-center">
              <img src="/hero/hero-tribal-jacket.png" alt="After: AI try-on result wearing tribal jacket" loading="lazy" className="w-[140px] xl:w-[155px] aspect-[3/4] object-cover rounded-[18px] bg-[#2a2a2a]" />
              <figcaption className="text-[10.5px] text-white/45 mt-2 font-medium">After</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="max-w-[1280px] mx-auto px-6 mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight text-[#111]">Shop by Category</h2>
            <p className="text-sm text-black/55 mt-0.5">Explore styles for every mood.</p>
          </div>
          <Link href="/discover" className="text-xs font-bold hover:underline shrink-0">View all →</Link>
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3.5 mt-5">
          {CATEGORIES.map((c) => (
            <Link key={c.name} href={`/discover?category=${encodeURIComponent(c.name)}`} className="group">
              <span className="block aspect-[3/4] rounded-[18px] overflow-hidden bg-[#f0efe9] border border-black/[0.06]">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  style={{ objectPosition: c.pos }}
                  className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-300"
                />
              </span>
              <span className="block text-center text-[11.5px] font-semibold mt-2 text-black/70">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= TRENDING OUTFITS ================= */}
      <section className="max-w-[1280px] mx-auto px-6 mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight text-[#111]">Trending Outfits</h2>
            <p className="text-sm text-black/55 mt-0.5">Get inspired by curated looks.</p>
          </div>
          <Link href="/outfit" className="text-xs font-bold hover:underline shrink-0">View all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-5 items-stretch">
          {OUTFITS.map((o) => (
            <div key={o.titleB} className={`${o.bg} rounded-[22px] p-5 flex gap-4 items-center border border-black/[0.05]`}>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold leading-tight text-[15px] text-[#111]">{o.titleA}<br />{o.titleB}</p>
                <ul className="mt-2.5 space-y-1 text-[11.5px] text-black/60">
                  {o.items.map((i) => <li key={i} className="flex gap-1.5"><span aria-hidden="true">•</span>{i}</li>)}
                </ul>
                <Link href="/outfit" className="inline-flex items-center h-9 mt-3.5 rounded-full bg-white text-[11.5px] font-bold px-4 shadow-sm border border-black/[0.06] hover:bg-[#111] hover:text-white transition">Build this look →</Link>
              </div>
              <div className="flex gap-2 shrink-0">
                <img src={o.img} alt={`${o.titleA} ${o.titleB} flat-lay`} loading="lazy" className="w-[132px] aspect-[3/4] object-cover rounded-[14px] bg-white border border-black/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-[1280px] mx-auto px-6 mt-8">
        <div className="relative overflow-hidden rounded-[22px] bg-[#2b2723] text-white">
          <img src="/products/tan-brown-denim-trucker-jacket.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/10" aria-hidden="true" />
          <div className="relative px-7 md:px-12 py-12 md:py-14 max-w-[560px]">
            <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight">Ready to create your look?</h2>
            <p className="text-sm text-white/70 mt-2">Upload a photo and let AI style you.</p>
            <Link href="/try-on" className="h-12 inline-flex items-center mt-6 rounded-full bg-[#c9f158] text-[#111] text-sm font-bold px-8 hover:brightness-[0.96] transition">Try an Outfit →</Link>
          </div>
          <img
            src="/hero/hero-main-beige-overshirt.png"
            alt="Smiling model in styled casual outfit"
            loading="lazy"
            className="hidden md:block absolute right-12 bottom-0 h-[112%] w-[240px] object-cover object-top rounded-t-[18px] shadow-2xl"
          />
        </div>
      </section>
    </div>
  );
}
