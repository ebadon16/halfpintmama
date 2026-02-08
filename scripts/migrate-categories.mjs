/**
 * One-time Sanity migration script
 * Migrates posts: travel → mama-life, diy → cooking
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<your-token> node scripts/migrate-categories.mjs
 *
 * Generate a write token at: manage.sanity.io > API > Tokens
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-12-01",
  useCdn: false,
  token,
});

async function migrate() {
  // Fetch travel posts → mama-life
  const travelPosts = await client.fetch(
    `*[_type == "post" && category == "travel"]{ _id, title, slug }`
  );
  console.log(`Found ${travelPosts.length} travel posts to migrate → mama-life`);

  // Fetch diy posts → cooking
  const diyPosts = await client.fetch(
    `*[_type == "post" && category == "diy"]{ _id, title, slug }`
  );
  console.log(`Found ${diyPosts.length} diy posts to migrate → cooking`);

  if (travelPosts.length === 0 && diyPosts.length === 0) {
    console.log("No posts to migrate. Done!");
    return;
  }

  // Use transaction for atomic batch update
  const transaction = client.transaction();

  for (const post of travelPosts) {
    transaction.patch(post._id, (p) => p.set({ category: "mama-life" }));
    console.log(`  [travel → mama-life] "${post.title}" (${post.slug?.current})`);
  }

  for (const post of diyPosts) {
    transaction.patch(post._id, (p) => p.set({ category: "cooking" }));
    console.log(`  [diy → cooking] "${post.title}" (${post.slug?.current})`);
  }

  console.log("\nCommitting transaction...");
  await transaction.commit();
  console.log(`Done! Migrated ${travelPosts.length + diyPosts.length} posts.`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
