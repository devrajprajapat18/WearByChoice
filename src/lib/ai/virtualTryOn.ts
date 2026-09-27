import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Product, VirtualTryOnProvider, VirtualTryOnResult } from "@/types";

export class MockVirtualTryOnProvider implements VirtualTryOnProvider {
  name = "mock";
  async generateTryOn(userImage: string, products: Product[]): Promise<VirtualTryOnResult> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      id: "tryon_" + Math.random().toString(36).slice(2, 10),
      status: "completed",
      // Mock mode: return the user image with a clearly-labeled demo treatment.
      // A real provider (REST image model) replaces this adapter without UI changes.
      resultImage: userImage,
      products,
      message: "Demo preview (mock provider). Set VIRTUAL_TRYON_PROVIDER=replicate with a REPLICATE_API_TOKEN for real AI try-on."
    };
  }
}

export class RemoteVirtualTryOnProvider implements VirtualTryOnProvider {
  name = "remote";
  async generateTryOn(userImage: string, products: Product[]): Promise<VirtualTryOnResult> {
    const url = process.env.VIRTUAL_TRYON_API_URL;
    const key = process.env.VIRTUAL_TRYON_API_KEY;
    if (!url || !key) throw new Error("Virtual try-on provider not configured");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        userImage,
        garments: products.map((p) => ({ id: p.id, name: p.name, category: p.category, image: p.thumbnail }))
      })
    });
    if (!res.ok) throw new Error("Virtual try-on provider failed");
    const data = await res.json();
    return {
      id: String(data.id ?? "tryon_remote"),
      status: "completed",
      resultImage: String(data.resultImage ?? data.image ?? userImage),
      products
    };
  }
}

type IdmCategory = "upper_body" | "lower_body" | "dresses";

const CATEGORY_MAP: Record<string, IdmCategory> = {
  "T-Shirts": "upper_body", Shirts: "upper_body", Tops: "upper_body",
  Jackets: "upper_body", Hoodies: "upper_body", Sweaters: "upper_body", Kurtas: "upper_body",
  Jeans: "lower_body", Trousers: "lower_body", Cargo: "lower_body", Shorts: "lower_body",
  Dresses: "dresses", Sarees: "dresses"
};

function idmCategory(p: Product): IdmCategory | null {
  return CATEGORY_MAP[p.category] ?? null;
}

// IDM-VTON accepts one garment per run. Resolve the garment image to something
// the API can fetch: remote URLs pass through; local /public files are inlined
// as data URIs (required for localhost dev, which Replicate cannot reach).
async function resolveGarmentImage(p: Product): Promise<string> {
  const thumb = p.images[0] ?? p.thumbnail;
  if (/^https?:\/\//i.test(thumb)) return thumb;
  if (/^data:image\//i.test(thumb)) return thumb;
  if (thumb.startsWith("/")) {
    const abs = join(process.cwd(), "public", thumb.replace(/^\//, ""));
    const buf = await readFile(abs);
    const ext = (abs.split(".").pop() ?? "jpg").toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  }
  throw new Error(`Cannot resolve garment image for "${p.name}". Upload the product image to public/products/ first.`);
}

async function runIdmVton(
  token: string,
  humanImg: string,
  garmentImg: string,
  garment: Product
): Promise<string> {
  const version = process.env.REPLICATE_MODEL_VERSION ?? "906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f";
  const category = idmCategory(garment) ?? "upper_body";
  const created = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      version,
      input: {
        human_img: humanImg,
        garm_img: garmentImg,
        garment_des: `${garment.name} (${garment.category})`,
        category,
        crop: true,
        steps: 30,
        seed: 42
      }
    })
  });
  if (created.status === 402) throw new Error("Replicate billing required: add credits at replicate.com/account/billing.");
  if (created.status === 401) throw new Error("Invalid REPLICATE_API_TOKEN.");
  if (!created.ok) throw new Error("Virtual try-on provider failed to start generation.");
  let pred = await created.json();
  const deadline = Date.now() + 4 * 60_000;
  while (["starting", "processing"].includes(pred.status)) {
    if (Date.now() > deadline) throw new Error("Generation timed out. Please try again.");
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Token ${token}` }
    });
    if (!poll.ok) throw new Error("Virtual try-on provider failed during generation.");
    pred = await poll.json();
  }
  if (pred.status !== "succeeded") throw new Error("AI generation failed. Please try again with a clearer photo.");
  const out = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  if (!out || typeof out !== "string") throw new Error("Virtual try-on provider returned no image.");
  return out;
}

/**
 * Real AI try-on via Replicate IDM-VTON (~$0.024/run, pay-per-use).
 * Multi-item outfits are applied garment-by-garment (output of one run feeds
 * the next). Non-garment items (shoes, watches, bags…) are skipped with a note
 * since the model only synthesizes clothing.
 */
export class ReplicateTryOnProvider implements VirtualTryOnProvider {
  name = "replicate";
  async generateTryOn(userImage: string, products: Product[]): Promise<VirtualTryOnResult> {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error("REPLICATE_API_TOKEN is not set. See README for setup.");
    const wearables = products.filter((p) => idmCategory(p) !== null);
    if (!wearables.length) {
      throw new Error("None of the selected items are try-on compatible (clothing only — shoes, watches and accessories are skipped).");
    }
    const skipped = products.filter((p) => idmCategory(p) === null).map((p) => p.name);
    let current = userImage;
    for (const g of wearables.slice(0, 4)) {
      const garmentImg = await resolveGarmentImage(g);
      current = await runIdmVton(token, current, garmentImg, g);
    }
    return {
      id: "tryon_" + Math.random().toString(36).slice(2, 10),
      status: "completed",
      resultImage: current,
      products,
      message: skipped.length
        ? `AI visualized the clothing. Not visualized (model limitation): ${skipped.join(", ")}.`
        : "AI-generated try-on (Replicate IDM-VTON)."
    };
  }
}

export function getTryOnProviderName(): string {
  return process.env.VIRTUAL_TRYON_PROVIDER ?? "mock";
}

export function getTryOnProvider(): VirtualTryOnProvider {
  const which = getTryOnProviderName();
  if (which === "replicate") return new ReplicateTryOnProvider();
  if (which === "remote") return new RemoteVirtualTryOnProvider();
  return new MockVirtualTryOnProvider();
}
