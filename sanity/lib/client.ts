import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "nt42z7dh",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export async function fetchSanity<T>(query: string, fallback: T): Promise<T> {
  try {
    const data = await client.fetch<T>(query);
    return data ?? fallback;
  } catch (err) {
    console.error("[Sanity]", err);
    return fallback;
  }
}
