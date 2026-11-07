import { cache } from "react";
import { fetchSanity } from "../../sanity/lib/client";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_TAGLINE,
  SOCIAL_LINKS,
} from "./packages";

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  social: {
    instagram: string;
    tiktok: string;
    facebook: string;
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await fetchSanity<Partial<SiteSettings>>(
    `*[_type == "siteSettings"][0]{ businessName, tagline, phone, email, city, address, social }`,
    {}
  );

  return {
    businessName: settings.businessName || BUSINESS_NAME,
    tagline: settings.tagline || BUSINESS_TAGLINE,
    phone: settings.phone || BUSINESS_PHONE,
    email: settings.email || BUSINESS_EMAIL,
    city: settings.city || BUSINESS_CITY,
    address: settings.address ?? BUSINESS_ADDRESS,
    social: {
      instagram: settings.social?.instagram ?? SOCIAL_LINKS.instagram,
      tiktok: settings.social?.tiktok ?? SOCIAL_LINKS.tiktok,
      facebook: settings.social?.facebook ?? SOCIAL_LINKS.facebook,
    },
  };
});
