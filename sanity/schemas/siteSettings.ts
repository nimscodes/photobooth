export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    { name: "businessName", title: "Business Name", type: "string" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "phone", title: "Phone Number", type: "string" },
    { name: "email", title: "Email Address", type: "string" },
    { name: "city", title: "City / Service Area", type: "string" },
    { name: "address", title: "Address", type: "string" },
    {
      name: "social",
      title: "Social Media",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "tiktok", title: "TikTok URL", type: "url" },
        { name: "facebook", title: "Facebook URL", type: "url" },
      ],
    },
  ],
  preview: { select: { title: "businessName" } },
};
