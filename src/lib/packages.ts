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
    id: "snapshot",
    name: "Snapshot",
    price: 350,
    hours: 2,
    description: "Perfect for intimate parties & small gatherings",
    features: [
      "2-hour Open-Air iPad Booth",
      "Digital sharing (QR / text / email)",
      "Standard backdrop & basic props",
      "Online gallery delivery",
    ],
  },
  {
    id: "spotlight",
    name: "Spotlight",
    price: 600,
    hours: 3,
    description: "Most popular for birthdays & celebrations",
    features: [
      "3-hour Open-Air iPad Booth",
      "Digital sharing + basic prints (optional)",
      "Custom template overlay",
      "Professional attendant",
      "Online gallery delivery",
    ],
    popular: true,
  },
  {
    id: "red-carpet",
    name: "Red Carpet",
    price: 900,
    hours: 4,
    description: "Luxury experience for weddings & upscale events",
    features: [
      "4-hour 360 Video Booth",
      "Unlimited shares",
      "Custom branding/logo on videos",
      "Premium backdrop + props",
      "Attendant on site",
      "Online gallery delivery",
    ],
  },
  {
    id: "vip",
    name: "VIP Experience",
    price: 1500,
    hours: 6,
    description: "The ultimate all-inclusive photo booth package",
    features: [
      "3-hour 360 Video Booth",
      "3-hour Open-Air iPad Booth",
      "Unlimited shares",
      "Digital delivery + prints",
      "Custom branded overlays",
      "Premium themed backdrop + props",
      "Two attendants on site",
      "Online gallery delivery",
    ],
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: "extra-hour",
    name: "Extra Hour",
    price: 150,
  },
  {
    id: "audio-guestbook",
    name: "Audio Guestbook",
    price: 250,
  },
  {
    id: "custom-overlay",
    name: "Custom Logo Overlay",
    price: 100,
    hasUpload: true,
  },
  {
    id: "branded-backdrop",
    name: "Branded Backdrop",
    price: 200,
    hasOptions: true,
  },
  {
    id: "floral-wall",
    name: "Floral Wall",
    price: 350,
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

// ── Business Info ──────────────────────────────────────────────────────────────
export const BUSINESS_NAME = "Elite Event Images";
export const BUSINESS_TAGLINE = "Luxury Photo Booth Experiences";
export const BUSINESS_PHONE = "(817) 555-0100";
export const BUSINESS_EMAIL = "hello@eliteeventimages.com";
export const BUSINESS_CITY = "Fort Worth, TX";
export const BUSINESS_ADDRESS = "Haslet, TX";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/elite_eventimages",
  tiktok: "https://www.tiktok.com/@elite_eventimages",
  facebook: "https://www.facebook.com/elite.eventimages",
};
