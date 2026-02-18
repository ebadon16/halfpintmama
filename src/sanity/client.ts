import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-12-01",
  useCdn: true,
});

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
