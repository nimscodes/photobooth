export interface Package {
  id: string;
  name: string;
  price: number;
  hours: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
  hasUpload?: boolean;
  imageUrl?: string;
  featured?: boolean;
}

export const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic Experience",
    price: 350,
    hours: 2,
    description: "A simple digital photo booth experience for your event.",
    features: [
      "Digital photo booth experience",
      "Unlimited sessions",
      "Digital sharing",
      "Standard photo layout",
    ],
  },
  {
    id: "signature",
    name: "Signature Experience",
    price: 475,
    hours: 3,
    description: "Everything in Basic, plus on-site printing and a personalized photo template.",
    features: [
      "Everything in Basic",
      "On-site printing",
      "Personalized photo template",
      "80 photo prints included",
    ],
  },
  {
    id: "premier",
    name: "Premier Experience",
    price: 625,
    hours: 4,
    description: "Everything in Signature, plus enhanced customization and an online gallery.",
    features: [
      "Everything in Signature",
      "Enhanced customization",
      "Online gallery",
      "150 photo prints included",
    ],
  },
  {
    id: "elite",
    name: "Elite Experience",
    price: 775,
    hours: 5,
    description: "Everything in Premier, plus additional print options and premium personalization.",
    features: [
      "Everything in Premier",
      "Additional print options",
      "Premium personalization",
      "200 photo prints included",
      "Prop Table",
    ],
  },
];

export const PRICING_DISCLAIMER =
  "Prices are proposed starting rates for discussion, not confirmed final rates. Confirm travel fees, taxes, deposits, overtime, and booking terms.";

export const ADD_ONS: AddOn[] = [
  {
    id: "extra-hour",
    name: "Extra Hour",
    price: 150,
  },
  {
    id: "custom-overlay",
    name: "Custom Logo Overlay",
    price: 100,
    description: "Upload your own logo file",
    hasUpload: true,
  },
];

export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Corporate",
  "Party",
  "Other",
];

// ── Business Info ──────────────────────────────────────────────────────────────
export const BUSINESS_NAME = "Elite Event Images";
export const BUSINESS_TAGLINE = "Luxury Photo Booth Experiences";
export const BUSINESS_PHONE = "(817) 555-0100";
export const BUSINESS_EMAIL = "info@eliteeventimages.com";
export const BUSINESS_CITY = "Fort Worth, TX";
export const BUSINESS_ADDRESS = "Haslet, TX";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/elite_eventimages",
  tiktok: "https://www.tiktok.com/@elite_eventimages",
  facebook: "https://www.facebook.com/elite.eventimages",
};
