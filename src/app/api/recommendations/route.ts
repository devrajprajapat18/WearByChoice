import { NextResponse } from "next/server";
import { z } from "zod";
import { getProvider } from "@/lib/providers/mockProvider";

// AI stylist: only recommends products that exist in the catalog.
export async function POST(req: Request) {
  try {
    const { request: userRequest, budget } = z.object({ request: z.string().min(3).max(500), budget: z.number().optional() }).parse(await req.json());
    const q = userRequest.toLowerCase();
    // Sanitize: strip any prompt-injection-ish instructions; treat input as search text only.
    const clean = q.replace(/(ignore|system|prompt|instruction).{0,40}/g, "").slice(0, 300);
    let pool = await getProvider().searchProducts(clean, {});
    if (!pool.length) pool = await getProvider().searchProducts("", {});
    if (budget) pool = pool.filter((p) => p.price <= budget);
    const pick = (cat: string) => pool.find((p) => p.category.toLowerCase() === cat);
    const outfit = [
      pick("shirts") ?? pick("t-shirts") ?? pick("tops") ?? pick("dresses") ?? pick("kurtas") ?? pool[0],
      pick("trousers") ?? pick("jeans") ?? pick("cargo") ?? pool[1],
      pick("sneakers") ?? pick("shoes") ?? pool[2],
      pick("watches") ?? pick("accessories") ?? pool[3]
    ].filter(Boolean).slice(0, 4);
    const total = outfit.reduce((s, p) => s + p!.price, 0);
    return NextResponse.json({ outfit, total, note: "Recommended from live catalog only — no invented products." });
  } catch {
    return NextResponse.json({ error: "Invalid recommendation request" }, { status: 400 });
  }
}
