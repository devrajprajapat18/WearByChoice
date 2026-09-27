# WearByChoice — See it. Style it. Wear it.

AI-powered virtual outfit try-on: **Discover → Select → Build Outfit → Upload Photo → Try On → Save → Shop**.

## Features
- Product discovery: search, category/gender/brand/price/color/size/rating filters, sorting, product detail with gallery + retailer/affiliate links
- Outfit Builder (top → bottom → shoes → watch → accessories), save outfits (localStorage; Prisma in prod)
- Virtual try-on: `POST /api/try-on` async jobs (202 + poll `GET /api/try-on/:id`), staged progress UI, before/after view, download/share
- Auth: register/login/logout/me with bcrypt + JWT HTTP-only cookies
- Wishlist, saved outfits, try-on history, profile, admin dashboard + product sync
- AI stylist `POST /api/recommendations` — recommends **only** catalog products, input sanitized
- Dark-mode-ready design system, Framer Motion, skeleton/empty/error states, responsive + mobile bottom nav
- SEO: dynamic metadata, OpenGraph, sitemap, robots, slug URLs (`/products/:slug`)

## Tech stack
Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Zustand · Zod · bcryptjs + JWT · Prisma + PostgreSQL (prod) · Mock providers for zero-credential dev

## Architecture
```
Retailer API → ProductProvider adapter → normalizeProviderProduct() → dedupe → store → WearByChoice API → Frontend
User image + products → VirtualTryOnProvider (mock | remote) → async job → result
```
- Providers: `src/lib/providers/mockProvider.ts` (`MockProductProvider`, `getProvider()`); add `retailerA.ts` implementing `ProductProvider`
- AI: `src/lib/ai/virtualTryOn.ts` (`MockVirtualTryOnProvider`, `RemoteVirtualTryOnProvider`, `getTryOnProvider()`)
- Frontend only consumes the normalized `Product` type (`src/types/index.ts`)

## Folder structure
```
src/app/{page,discover,products/[slug],outfit,try-on,saved,profile,login,register,admin,api/...}
src/components/{Navbar,ProductCard,AuthForm}
src/lib/{providers,ai,auth,validation,store}.ts
prisma/{schema.prisma,seed.ts}
tests/core.test.ts
```

## Env
Copy `.env.example` → `.env`. Never commit `.env`. Keys stay server-side (`src/lib/ai`, API routes only).

## Database setup (production)
```
npm i
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

## Running locally (no credentials needed)
```
npm install
npm run dev   # http://localhost:3000
npm test      # vitest
npm run build
```
Mock providers serve 30 demo products (placeholder images via picsum.photos) and demo try-on.

## Product API configuration
Set `PRODUCT_PROVIDER`, `PRODUCT_API_KEY/SECRET/BASE_URL`, `AFFILIATE_ID`. Implement a new `ProductProvider`, register in `providerRegistry`, sync via `POST /api/admin/products/sync`. Images are referenced by URL, not stored, unless the provider permits it.

## Virtual try-on configuration
Default `VIRTUAL_TRYON_PROVIDER=mock` (clearly labeled demo preview — it returns
your photo unchanged). For **real AI try-on** the app ships a `ReplicateTryOnProvider`
(IDM-VTON, ~$0.024 per generation, pay-per-use) — no UI rewrite needed:

1. Sign up at replicate.com, go to **Billing**, and add a few dollars of credit.
2. Go to **Account → API tokens**, create and copy a token.
3. In `.env`, set `VIRTUAL_TRYON_PROVIDER=replicate` and `REPLICATE_API_TOKEN=<token>`.
4. Restart the dev server. The try-on page badge flips from "Demo preview mode" to "Live AI try-on".

Notes: one garment is synthesized per model run, so multi-item outfits are applied
top → bottom automatically (each ~30–60s). Shoes, watches, bags and other accessories
are skipped with an on-screen note (model limitation). Product images stored locally
under `public/` are inlined as data URIs, so localhost dev works. Jobs are async;
production deployments need a real queue (BullMQ/trigger.dev) since serverless
functions freeze after responding. User images are data-URLs in transit, never stored
server-side; delete/replace anytime.

## Testing / deployment / security
- `tests/core.test.ts`: normalization, dedupe, image validation. Extend with auth/wishlist/outfit integration tests.
- Deploy on Vercel/Node with Postgres + `AUTH_SECRET`, `DATABASE_URL`. Rate limiting on try-on, Zod validation everywhere, no secrets/stack traces to clients, file type/size checks, prompt-injection sanitizing in recommendations.
