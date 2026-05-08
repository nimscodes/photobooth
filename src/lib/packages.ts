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
  hasUpload?: boolean;
  hasOptions?: boolean;
}

export const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic",
    price: 399,
    hours: 2,
    description: "Perfect for smaller gatherings and casual events",
    features: [
      "2-hour rental",
      "Unlimited prints",
      "Digital copies included",
      "Fun prop collection",
      "Photo strip templates",
      "Online gallery delivery",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 549,
    hours: 3,
    description: "Our most popular choice for birthdays and parties",
    features: [
      "3-hour rental",
      "Unlimited prints",
      "Digital gallery",
      "Premium prop collection",
      "Dedicated attendant",
      "Custom photo template",
      "Online gallery delivery",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 699,
    hours: 4,
    description: "Ideal for weddings and upscale corporate events",
    features: [
      "4-hour rental",
      "Unlimited prints",
      "Digital gallery",
      "Premium prop collection",
      "Dedicated attendant",
      "Custom backdrop",
      "Custom logo/overlay",
      "Social sharing station",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    price: 899,
    hours: 5,
    description: "The ultimate experience — everything included",
    features: [
      "5-hour rental",
      "Unlimited prints",
      "Digital gallery",
      "Premium prop collection",
      "Dedicated attendant",
      "Custom backdrop",
      "Custom logo/overlay",
      "Social sharing station",
      "Video booth option",
      "Scrapbook / guestbook",
    ],
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: "extra-hours",
    name: "2 Extra Hours",
    price: 199,
  },
  {
    id: "custom-overlay",
    name: "Custom Logo / Overlay",
    price: 75,
    hasUpload: true,
  },
  {
    id: "custom-backdrop",
    name: "Custom Backdrop",
    price: 125,
    hasOptions: true,
  },
  {
    id: "digital-only",
    name: "Digital Only (no prints)",
    price: -50,
  },
];

export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Corporate",
  "Party",
  "Other",
];

export const BACKDROP_OPTIONS = [
  "White Sequin",
  "Black Sequin",
  "Gold Glam",
  "Blush Pink",
  "Greenery / Floral",
  "Custom (describe in notes)",
];

// ── Business Info ── update these to match your business ──────────────────────
export const BUSINESS_NAME = "Flash Photo Booth";
export const BUSINESS_TAGLINE = "Capture Every Smile";
export const BUSINESS_PHONE = "(555) 123-4567";
export const BUSINESS_EMAIL = "hello@flashphotobooth.com";
export const BUSINESS_CITY = "Atlanta, GA";
