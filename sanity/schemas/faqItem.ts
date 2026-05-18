export default {
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    { name: "question", title: "Question", type: "string" },
    { name: "answer", title: "Answer", type: "text", rows: 4 },
    { name: "order", title: "Order (lower = first)", type: "number" },
  ],
  preview: { select: { title: "question" } },
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
};
