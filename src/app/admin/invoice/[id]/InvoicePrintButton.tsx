"use client";

export default function InvoicePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-5 py-2 rounded-full bg-[#8B5CF6] text-[#0B1020] font-bold text-sm hover:bg-[#7c3aed] transition-colors"
    >
      Print / Save PDF
    </button>
  );
}
