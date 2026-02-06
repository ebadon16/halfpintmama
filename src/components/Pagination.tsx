import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-full border-2 border-sage text-deep-sage font-semibold hover:bg-sage hover:text-white transition-all"
        >
          &larr; Prev
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-full border-2 border-light-sage text-charcoal/40 cursor-not-allowed">
          &larr; Prev
        </span>
      )}

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-charcoal/50">
              ...
            </span>
          ) : page === currentPage ? (
            <span
              key={page}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-sage text-white font-semibold"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-light-sage text-deep-sage hover:bg-light-sage transition-all"
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Mobile: Current / Total */}
      <span className="sm:hidden text-charcoal/70">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 rounded-full border-2 border-sage text-deep-sage font-semibold hover:bg-sage hover:text-white transition-all"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-full border-2 border-light-sage text-charcoal/40 cursor-not-allowed">
          Next &rarr;
        </span>
      )}
    </nav>
  );
}
