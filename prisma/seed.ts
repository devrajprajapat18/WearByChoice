import { MOCK_PRODUCTS } from "../src/lib/providers/mockProvider";
// Seed script: in production, upserts normalized provider products into Postgres via Prisma.
// Run: npm run db:seed (requires DATABASE_URL). Dev mode works without a DB using the mock provider.
async function main() {
  console.log(`Seed ready: ${MOCK_PRODUCTS.length} demo products from MockProductProvider.`);
  console.log("Configure DATABASE_URL + npx prisma migrate dev, then extend this script with Prisma upserts.");
}
main();
