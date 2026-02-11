import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams({ page: String(page) });
    if (extraParams) {
      for (const [k, v] of Object.entries(extraParams)) {
        params.set(k, v);
      }
    }
    return `${basePath}?${params}`;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-ink/40">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={buildHref(currentPage - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink/60 hover:bg-white/5 transition-colors"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={buildHref(currentPage + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink/60 hover:bg-white/5 transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
