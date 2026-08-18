"use client";

import { Search, ArrowUpDown } from "lucide-react";
import type { CollegeCategory } from "@/lib/supabase/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type MatchSort = "index-desc" | "index-asc" | "admit-rate" | "tuition";

export type CategoryFilter = "all" | CollegeCategory;

interface CategoryFilterBarProps {
  search: string;
  onSearch: (value: string) => void;
  category: CategoryFilter;
  onCategory: (value: CategoryFilter) => void;
  region: string;
  onRegion: (value: string) => void;
  regions: string[];
  sort: MatchSort;
  onSort: (value: MatchSort) => void;
  counts: Record<CollegeCategory, number>;
}

const categoryOptions: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "reach", label: "Reach" },
  { value: "target", label: "Target" },
  { value: "safety", label: "Safety" },
];

export function CategoryFilterBar({
  search,
  onSearch,
  category,
  onCategory,
  region,
  onRegion,
  regions,
  sort,
  onSort,
  counts,
}: CategoryFilterBarProps) {
  return (
    <div className="glass flex flex-col gap-4 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search schools by name or program…"
            className="pl-10"
            aria-label="Search colleges"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onCategory(option.value)}
              aria-pressed={category === option.value}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                category === option.value
                  ? "bg-gradient-brand text-white shadow-glow-brand"
                  : "bg-zinc-900/5 text-zinc-600 hover:bg-zinc-900/10 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15"
              )}
            >
              {option.label}
              {option.value !== "all" ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs font-bold",
                    category === option.value
                      ? "bg-white/25 text-white"
                      : "bg-zinc-900/5 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
                  )}
                >
                  {counts[option.value]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={region}
            onChange={(e) => onRegion(e.target.value)}
            aria-label="Filter by region"
            className="w-48"
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-zinc-400" aria-hidden />
          <Select
            value={sort}
            onChange={(e) => onSort(e.target.value as MatchSort)}
            aria-label="Sort matches"
            className="w-52"
          >
            <option value="index-desc">Strength: high → low</option>
            <option value="index-asc">Strength: low → high</option>
            <option value="admit-rate">Admit rate: easiest first</option>
            <option value="tuition">Tuition: lowest first</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
