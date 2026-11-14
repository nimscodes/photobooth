import { fetchSanity } from "../../sanity/lib/client";
import { PACKAGES, ADD_ONS, type Package, type AddOn } from "./packages";

interface SanityPackage {
  packageId: string;
  name: string;
  price: number;
  hours: number;
  description: string;
  features: string[];
  popular?: boolean;
  order?: number;
}

interface SanityAddOn {
  addOnId: string;
  name: string;
  price: number;
  description?: string;
  order?: number;
  image?: { asset?: { url?: string } };
  featured?: boolean;
}

const PACKAGE_INCLUSIONS: Record<string, string[]> = {
  signature: ["80 photo prints included"],
  premier: ["150 photo prints included"],
  elite: ["200 photo prints included", "Prop Table"],
};

function packageTier(packageId: string, name: string): string | undefined {
  const identifier = `${packageId} ${name}`.toLowerCase();
  if (identifier.includes("signature")) return "signature";
  if (identifier.includes("premier")) return "premier";
  if (identifier.includes("elite")) return "elite";
  return undefined;
}

const RETIRED_ADD_ONS = new Set([
  "audio-guestbook",
  "branded-backdrop",
  "floral-wall",
  "flower-wall",
]);

function isRetiredAddOn(addOn: SanityAddOn): boolean {
  return RETIRED_ADD_ONS.has(addOn.addOnId.toLowerCase()) ||
    /audio guestbook|(?:flower|floral) wall|branded backdrop/i.test(addOn.name);
}

export async function getPackages(): Promise<Package[]> {
  const data = await fetchSanity<SanityPackage[]>(
    `*[_type == "photoPackage"] | order(order asc){ packageId, name, price, hours, description, features, popular }`,
    []
  );
  if (!data || data.length === 0) return PACKAGES;
  const packages = data
    .filter((p) => !/(?:360\s*(?:video)?\s*booth|(?:roaming|open[- ]air)\s+iPad\s+booth|glam(?:our)?\s+booth)/i.test(`${p.name} ${p.description} ${(p.features ?? []).join(" ")}`))
    .map((p) => {
      const features = p.features ?? [];
      const inclusions = PACKAGE_INCLUSIONS[packageTier(p.packageId, p.name) ?? ""] ?? [];
      return {
        id: p.packageId,
        name: p.name,
        price: p.price,
        hours: p.hours,
        description: p.description,
        features: [...features, ...inclusions.filter((item) => !features.includes(item))],
        popular: p.popular ?? false,
      };
    });
  return packages.length > 0 ? packages : PACKAGES;
}

export async function getAddOns(): Promise<AddOn[]> {
  const data = await fetchSanity<SanityAddOn[]>(
    `*[_type == "photoAddOn"] | order(order asc){ addOnId, name, price, description, featured, image { asset->{ url } } }`,
    []
  );
  if (!data || data.length === 0) return ADD_ONS;
  return data.filter((a) => !isRetiredAddOn(a)).map((a) => ({
    id: a.addOnId,
    name: a.name,
    price: a.price,
    description: a.description,
    hasUpload: a.addOnId === "custom-overlay",
    imageUrl: a.image?.asset?.url,
    featured: a.featured ?? false,
  }));
}
