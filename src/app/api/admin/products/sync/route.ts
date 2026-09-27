import { NextResponse } from "next/server";
import { MOCK_PRODUCTS, dedupeProducts, normalizeProviderProduct } from "@/lib/providers/mockProvider";

export async function POST() {
  try {
    // 1. Fetch (mock provider stands in for retailer feeds) 2. normalize 3. dedupe 4. store
    const raw = MOCK_PRODUCTS.map((p) => ({ ...p }));
    const normalized = raw.map((r) => normalizeProviderProduct(r as unknown as Record<string, unknown>));
    const before = normalized.length;
    const deduped = dedupeProducts([...normalized, ...normalized.slice(0, 3)]);
    return NextResponse.json({ ok: true, synced: deduped.length, duplicatesRemoved: before + 3 - deduped.length, provider: "mock", at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
