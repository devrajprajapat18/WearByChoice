import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providers/mockProvider";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const products = await getProvider().searchProducts(searchParams.get("q") ?? "", {
      query: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? undefined,
      gender: searchParams.get("gender") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      color: searchParams.get("color") ?? undefined,
      size: searchParams.get("size") ?? undefined,
      minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
      sort: (searchParams.get("sort") as "popular") ?? "popular"
    });
    return NextResponse.json({ products, total: products.length });
  } catch {
    return NextResponse.json({ error: "Product service unavailable. Showing cached results is recommended." }, { status: 503 });
  }
}
