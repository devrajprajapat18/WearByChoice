import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providers/mockProvider";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const p = await getProvider().getProduct(params.id);
  if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  if (!p.availability) return NextResponse.json({ error: "Product unavailable", product: p }, { status: 410 });
  return NextResponse.json({ product: p });
}
