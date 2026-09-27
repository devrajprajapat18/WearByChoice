"use client";
import Link from "next/link";
import { useOutfit } from "@/lib/store";

export default function Navbar() {
  const count = useOutfit((s) => s.items.length);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-black/10">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3" aria-label="Main">
        <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/15" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </span>
          <span>Wear<span className="text-[#4d7c0f]">ByChoice</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-5 ml-6 text-sm font-medium text-black/70">
          <Link href="/discover" className="hover:text-black">Discover</Link>
          <Link href="/outfit" className="hover:text-black">Outfit Builder</Link>
          <Link href="/try-on" className="hover:text-black">Try On</Link>
          <Link href="/saved" className="hover:text-black">Saved</Link>
          <Link href="/discover" className="hover:text-black">Categories</Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/discover" className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5" aria-label="Search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          </Link>
          <Link href="/login" className="btn-ghost text-sm !py-2">Login</Link>
          <Link href="/try-on" className="rounded-full bg-ink text-white text-sm font-semibold px-5 py-2 hover:opacity-90 transition">
            Get Started
          </Link>
          {count > 0 && (
            <Link href="/outfit" className="hidden lg:inline-flex text-xs font-semibold border border-black/15 rounded-full px-3 py-2">
              Outfit ({count})
            </Link>
          )}
        </div>
      </nav>
      <nav className="md:hidden grid grid-cols-5 text-center text-xs font-medium border-t border-black/10" aria-label="Mobile">
        {[["/", "Home"], ["/discover", "Discover"], ["/outfit", "Outfit"], ["/try-on", "Try On"], ["/saved", "Saved"]].map(([h, l]) => (
          <Link key={h} href={h} className="py-2.5">{l}</Link>
        ))}
      </nav>
    </header>
  );
}
