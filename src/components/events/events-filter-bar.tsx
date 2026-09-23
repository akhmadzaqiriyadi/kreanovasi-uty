"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EventsFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  categories: string[];
  totalResults: number;
}

export function EventsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  categories,
  totalResults,
}: EventsFilterBarProps) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== "all" ||
    selectedType !== "all";

  const handleReset = () => {
    onSearchChange("");
    onCategoryChange("all");
    onTypeChange("all");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="search-events"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari agenda, topik workshop, pembicara, atau kata kunci..."
            className="pl-10 h-11 bg-background text-sm rounded-xl border-border/80 focus-visible:ring-primary/30"
          />
        </div>

        {/* Location Type Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50 shrink-0">
          <button
            type="button"
            onClick={() => onTypeChange("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              selectedType === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Semua Format
          </button>
          <button
            type="button"
            onClick={() => onTypeChange("offline")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              selectedType === "offline"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Tatap Muka
          </button>
          <button
            type="button"
            onClick={() => onTypeChange("hybrid")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              selectedType === "hybrid"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Hybrid
          </button>
        </div>
      </div>

      {/* Category Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            <span>Kategori:</span>
          </span>

          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            Semua ({totalResults})
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filter</span>
          </Button>
        )}
      </div>
    </div>
  );
}
