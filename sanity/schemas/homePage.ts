export default {
  name: "homePage",
  title: "Home Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    {
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        { name: "headline", title: "Headline", type: "string" },
        { name: "subtext", title: "Subtext", type: "text", rows: 3 },
        { name: "stat1Label", title: "Stat 1 Label", type: "string" },
        { name: "stat1Value", title: "Stat 1 Value", type: "string" },
        { name: "stat2Label", title: "Stat 2 Label", type: "string" },
        { name: "stat2Value", title: "Stat 2 Value", type: "string" },
        { name: "stat3Label", title: "Stat 3 Label", type: "string" },
        { name: "stat3Value", title: "Stat 3 Value", type: "string" },
      ],
    },
    {
      name: "about",
      title: "About Section",
      type: "object",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "paragraph1", title: "Paragraph 1", type: "text", rows: 4 },
        { name: "paragraph2", title: "Paragraph 2", type: "text", rows: 4 },
        { name: "paragraph3", title: "Paragraph 3", type: "text", rows: 3 },
      ],
    },
    {
      name: "cta",
      title: "Bottom CTA Section",
      type: "object",
      fields: [
        { name: "heading", title: "Heading", type: "string" },
        { name: "subtext", title: "Subtext", type: "text", rows: 2 },
      ],
    },
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
};
