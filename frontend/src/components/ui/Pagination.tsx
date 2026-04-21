import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationType } from "../../types";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, pages, total, limit } = pagination;
  if (pages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers to show (max 5)
  const pageNumbers: (number | "...")[] = [];
  if (pages <= 5) {
    for (let i = 1; i <= pages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++)
      pageNumbers.push(i);
    if (page < pages - 2) pageNumbers.push("...");
    pageNumbers.push(pages);
  }

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-bg-border">
      <span className="text-xs text-slate-500 font-mono">
        Showing {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-bg-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-500 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 rounded-md text-sm font-mono transition-colors ${
                p === page
                  ? "bg-accent text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-bg-elevated"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-bg-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
