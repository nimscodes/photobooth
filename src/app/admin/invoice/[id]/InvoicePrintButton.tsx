"use client";

export default function InvoicePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-5 py-2 rounded-full bg-[#c9a84c] text-[#0f0f1a] font-bold text-sm hover:bg-[#e0c06a] transition-colors"
    >
      Print / Save PDF
    </button>
  );
}
