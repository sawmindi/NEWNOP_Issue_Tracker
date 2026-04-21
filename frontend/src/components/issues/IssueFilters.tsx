import React, { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import type { IssueFilters } from "../../types";

interface IssueFiltersBarProps {
  filters: IssueFilters;
  onFilterChange: (filters: Partial<IssueFilters>) => void;
  onReset: () => void;
}

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const SEVERITIES = ["Minor", "Major", "Critical", "Blocker"];

export const IssueFiltersBar: React.FC<IssueFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Fire search query only after debounce - prevents excessive API calls
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const hasActiveFilters =
    !!filters.status || !!filters.priority || !!filters.severity || !!filters.search;

  const FilterSelect = ({
    value,
    onChange,
    options,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-bg-elevated border border-bg-border rounded-lg pl-3 pr-8 py-2
                   text-sm text-slate-300 focus:outline-none focus:border-accent cursor-pointer
                   transition-colors hover:border-slate-600"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search issues…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-base !pl-9 !pr-8"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(""); onFilterChange({ search: "" }); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <SlidersHorizontal size={14} className="text-slate-500 hidden sm:block" />

      <FilterSelect
        value={filters.status ?? ""}
        onChange={(v) => onFilterChange({ status: v as IssueFilters["status"] })}
        options={STATUSES}
        placeholder="Status"
      />
      <FilterSelect
        value={filters.priority ?? ""}
        onChange={(v) => onFilterChange({ priority: v as IssueFilters["priority"] })}
        options={PRIORITIES}
        placeholder="Priority"
      />
      <FilterSelect
        value={filters.severity ?? ""}
        onChange={(v) => onFilterChange({ severity: v as IssueFilters["severity"] })}
        options={SEVERITIES}
        placeholder="Severity"
      />

      {/* Sort */}
      <FilterSelect
        value={`${filters.sortBy}:${filters.sortOrder}`}
        onChange={(v) => {
          const [sortBy, sortOrder] = v.split(":");
          onFilterChange({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
        }}
        options={[
          "createdAt:desc",
          "createdAt:asc",
          "priority:desc",
          "updatedAt:desc",
        ]}
        placeholder="Sort"
      />

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
        >
          <X size={12} />
          Clear filters
        </button>
      )}
    </div>
  );
};
