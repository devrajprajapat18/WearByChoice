import { describe, it, expect } from "vitest";
import { normalizeProviderProduct, dedupeProducts } from "../src/lib/providers/mockProvider";
import { validateImageDataUrl } from "../src/lib/validation";

describe("product normalization", () => {
  it("normalizes foreign schemas", () => {
    const p = normalizeProviderProduct({ id: "x1", title: "Cool Shirt", price: "999", brand: "B", category: "Shirts", images: ["http://x/y.jpg"] });
    expect(p.name).toBe("Cool Shirt");
    expect(p.price).toBe(999);
  });
  it("dedupes by provider+externalId", () => {
    const a = normalizeProviderProduct({ id: "d1", name: "A", price: 100 });
    expect(dedupeProducts([a, a]).length).toBe(1);
  });
});

describe("image validation", () => {
  it("rejects non-images", () => {
    expect(validateImageDataUrl("data:text/plain;base64,xx").ok).toBe(false);
  });
  it("rejects bad types", () => {
    expect(validateImageDataUrl("data:image/gif;base64,xx").ok).toBe(false);
  });
});
