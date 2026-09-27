import { NextResponse } from "next/server";
import { tryOnSchema, validateImageDataUrl } from "@/lib/validation";
import { getProvider } from "@/lib/providers/mockProvider";
import { getTryOnProvider } from "@/lib/ai/virtualTryOn";

import { getJobs } from "@/lib/tryon-jobs";
import { getTryOnProviderName } from "@/lib/ai/virtualTryOn";

// Exposes only the provider *name* (never secrets) so the UI can badge demo vs live mode.
export async function GET() {
  const provider = getTryOnProviderName();
  return NextResponse.json({ provider, live: provider !== "mock" });
}

// In-memory async job store (production: Redis/BullMQ + Postgres TryOnSession).
const jobs = getJobs();

// Simple rate limit: 10 try-ons per minute per instance.
let calls: number[] = [];

export async function POST(req: Request) {
  try {
    const now = Date.now();
    calls = calls.filter((t) => now - t < 60_000);
    if (calls.length >= 10) return NextResponse.json({ error: "Rate limit exceeded. Try again soon." }, { status: 429 });
    calls.push(now);

    const body = tryOnSchema.parse(await req.json());
    const imgCheck = validateImageDataUrl(body.userImage);
    if (!imgCheck.ok) return NextResponse.json({ error: imgCheck.error }, { status: 400 });

    const provider = getProvider();
    const products = [];
    for (const { id } of body.products) {
      const p = await provider.getProduct(id);
      if (!p) return NextResponse.json({ error: `Invalid product ID: ${id}` }, { status: 400 });
      if (!p.availability) return NextResponse.json({ error: `Product unavailable: ${p.name}` }, { status: 410 });
      products.push(p);
    }

    const id = "tryon_" + Math.random().toString(36).slice(2, 10);
    jobs.set(id, { status: "processing", resultImage: null, products });

    // Async worker (do not block the request).
    (async () => {
      try {
        const result = await getTryOnProvider().generateTryOn(body.userImage, products);
        jobs.set(id, { status: "completed", resultImage: result.resultImage, products, message: result.message });
      } catch (e) {
        jobs.set(id, { status: "failed", resultImage: null, products, error: "AI generation failed. Please try again." });
      }
    })();

    return NextResponse.json({ id, status: "processing" }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Invalid try-on request" }, { status: 400 });
  }
}
