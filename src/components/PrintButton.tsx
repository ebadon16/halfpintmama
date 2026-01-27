"use client";

import { useEffect } from "react";

interface PrintButtonProps {
  title: string;
}

export function PrintButton({ title }: PrintButtonProps) {
  useEffect(() => {
    // Clean up class after print dialog closes
    const handleAfterPrint = () => {
      document.body.classList.remove("print-recipe-only");
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  const handlePrint = () => {
    // Add class to only print recipe card
    document.body.classList.add("print-recipe-only");

    // Set print-specific title
    const originalTitle = document.title;
    document.title = `${title} - Recipe | Half Pint Mama`;

    window.print();

    document.title = originalTitle;
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-charcoal bg-cream border-2 border-sage rounded-full hover:bg-sage hover:text-white transition-all"
      aria-label="Print recipe"
      data-print-hide
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print Recipe
    </button>
  );
}
