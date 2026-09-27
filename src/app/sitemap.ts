import type { MetadataRoute } from "next";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wearbychoice.example.com";
  return [{ url: base, lastModified: new Date() }, ...MOCK_PRODUCTS.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date() }))];
}
