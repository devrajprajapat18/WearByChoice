import { NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";

export async function GET() {
  const brands = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand)));
  const categories = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
  return NextResponse.json({ products: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length, brands, categories });
}
