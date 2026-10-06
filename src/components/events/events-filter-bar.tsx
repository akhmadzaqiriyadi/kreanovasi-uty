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
  selectedFee: "all" | "free" | "paid";
  onFeeChange: (fee: "all" | "free" | "paid") => void;
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
  selectedFee,
  onFeeChange,
  categories,
  totalResults,
}: EventsFilterBarProps) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== "all" ||
    selectedType !== "all" ||
    selectedFee !== "all";

  const handleReset = () => {
    onSearchChange("");
    onCategoryChange("all");
    onTypeChange("all");
    onFeeChange("all");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
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

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Fee Selector: Semua / Gratis / Berbayar */}
          <div className="grid grid-cols-3 items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/50 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onFeeChange("all")}
              className={cn(
                "px-2 sm:px-3 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedFee === "all"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Semua Biaya
            </button>
            <button
              type="button"
              onClick={() => onFeeChange("free")}
              className={cn(
                "px-2 sm:px-3 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedFee === "free"
                  ? "bg-background text-foreground shadow-xs font-bold text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Gratis
            </button>
            <button
              type="button"
              onClick={() => onFeeChange("paid")}
              className={cn(
                "px-2 sm:px-3 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedFee === "paid"
                  ? "bg-background text-foreground shadow-xs font-bold text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Berbayar
            </button>
          </div>

          {/* Location Type Selector: Semua / Tatap Muka / Daring / Hybrid */}
          <div className="grid grid-cols-4 items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/50 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onTypeChange("all")}
              className={cn(
                "px-2 sm:px-2.5 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedType === "all"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("offline")}
              className={cn(
                "px-2 sm:px-2.5 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedType === "offline"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Tatap Muka
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("online")}
              className={cn(
                "px-2 sm:px-2.5 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedType === "online"
                  ? "bg-background text-foreground shadow-xs font-bold text-sky-600 dark:text-sky-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Daring
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("hybrid")}
              className={cn(
                "px-2 sm:px-2.5 py-1.5 text-center text-xs font-semibold rounded-lg transition-all truncate",
                selectedType === "hybrid"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Hybrid
            </button>
          </div>
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
