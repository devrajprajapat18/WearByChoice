import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "WearByChoice — See it. Style it. Wear it.",
  description: "Choose your outfit and see how it looks on you before you buy.",
  openGraph: { title: "WearByChoice", description: "AI-powered virtual outfit try-on", type: "website" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-black/10 mt-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
            <div>
              <p className="font-black text-lg">Wear<span className="text-[#4d7c0f]">ByChoice</span></p>
              <p className="text-xs text-black/55 mt-2 max-w-[240px]">AI powered fashion try-on. Real products, real style.</p>
              <div className="flex gap-3 mt-4 text-black/60 text-sm">
                <span className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-black/10">◎</span>
                <span className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-black/10">✕</span>
                <span className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-black/10">▶</span>
              </div>
            </div>
            <div>
              <p className="font-bold text-sm mb-3">Explore</p>
              <ul className="space-y-2 text-sm text-black/60">
                <li><a href="/discover" className="hover:text-black">Discover</a></li>
                <li><a href="/outfit" className="hover:text-black">Outfit Builder</a></li>
                <li><a href="/try-on" className="hover:text-black">Try On</a></li>
                <li><a href="/discover" className="hover:text-black">Categories</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-sm text-black/60">
                <li>About</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-sm mb-3">Support</p>
              <ul className="space-y-2 text-sm text-black/60">
                <li>Help Center</li>
                <li>FAQ</li>
                <li>Feedback</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-sm">Stay in style</p>
              <p className="text-xs text-black/55 mt-1 mb-3">Get the latest updates and new collections.</p>
              <form className="flex gap-2" action="/discover" method="get">
                <input name="q" placeholder="Enter your email" aria-label="Email" className="input !py-2 text-sm" />
                <button className="rounded-full bg-ink text-white text-sm font-semibold px-5 hover:opacity-90 transition" type="submit">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="border-t border-black/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-black/50">
              <p>© 2024 WearByChoice. All rights reserved.</p>
              <p>Fashion looks better when it&apos;s you.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
