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
}

export async function getPackages(): Promise<Package[]> {
  const data = await fetchSanity<SanityPackage[]>(
    `*[_type == "photoPackage"] | order(order asc){ packageId, name, price, hours, description, features, popular }`,
    []
  );
  if (!data || data.length === 0) return PACKAGES;
  return data.map((p) => ({
    id: p.packageId,
    name: p.name,
    price: p.price,
    hours: p.hours,
    description: p.description,
    features: p.features ?? [],
    popular: p.popular ?? false,
  }));
}

export async function getAddOns(): Promise<AddOn[]> {
  const data = await fetchSanity<SanityAddOn[]>(
    `*[_type == "photoAddOn"] | order(order asc){ addOnId, name, price, description }`,
    []
  );
  if (!data || data.length === 0) return ADD_ONS;
  return data.map((a) => ({
    id: a.addOnId,
    name: a.name,
    price: a.price,
    hasUpload: a.addOnId === "custom-overlay",
    hasOptions: a.addOnId === "branded-backdrop",
  }));
}
