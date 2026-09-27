import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";
import { formatINR } from "@/lib/format";
import TryOnActions from "./actions";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = MOCK_PRODUCTS.find((x) => x.slug === params.slug);
  return { title: p ? `${p.name} — WearByChoice` : "Product — WearByChoice", description: p?.description };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = MOCK_PRODUCTS.find((x) => x.slug === params.slug);
  if (!p) return notFound();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <SafeImage src={p.images[0]} alt={p.name} seed={p.id} className="w-full rounded-2xl aspect-[3/4] object-cover" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {p.images.map((im) => <SafeImage key={im} src={im} alt={`${p.name} gallery`} seed={p.id} className="rounded-xl aspect-[3/4] object-cover" />)}
        </div>
      </div>
      <div>
        <p className="text-sm text-black/50">{p.brand} · {p.category} · {p.gender}</p>
        <h1 className="text-3xl font-black mt-1">{p.name}</h1>
        <p className="mt-2 text-2xl font-bold">{formatINR(p.price)} {p.originalPrice && <span className="line-through text-black/40 text-lg font-normal">{formatINR(p.originalPrice)}</span>}</p>
        <p className="mt-3 text-black/70">{p.description}</p>
        <p className="mt-3 text-sm">Colors: {p.colors.join(", ")} · Sizes: {p.sizes.join(", ")} · Rating: {p.rating}★</p>
        <p className="mt-1 text-sm text-black/50">Sold by {p.retailerName}</p>
        <TryOnActions id={p.id} url={p.affiliateUrl ?? p.productUrl} />
        <Link href="/discover" className="text-sm underline mt-4 inline-block">← Back to discover</Link>
      </div>
    </div>
  );
}
