import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export const tryOnSchema = z.object({
  userImage: z.string().min(100, "User image is required").max(12_000_000),
  products: z.array(z.object({ id: z.string().min(1) })).min(1).max(8)
});

export function validateImageDataUrl(dataUrl: string): { ok: boolean; error?: string } {
  if (!dataUrl.startsWith("data:image/")) return { ok: false, error: "Invalid image format" };
  const type = dataUrl.slice(11, dataUrl.indexOf(";"));
  if (!["jpeg", "jpg", "png", "webp"].includes(type)) return { ok: false, error: "Supported: JPG, JPEG, PNG, WEBP" };
  const bytes = Math.ceil((dataUrl.length * 3) / 4);
  if (bytes > 8_000_000) return { ok: false, error: "Image must be under 8MB" };
  return { ok: true };
}
