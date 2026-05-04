"use client";
import React, { useState, useEffect } from "react";
import TextInput from "@/components/UI/input";
import { cn } from "@/lib/utils";
import { drinkTypes } from "../models";
import { Heart, SlidersHorizontal } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export type AlcoholicFilter = "all" | "yes" | "no";

const FILTERS_STORAGE_KEY = "drinkmaker:filters";

interface StoredFilters {
  searchTerm: string;
  drinkType: string;
  alcoholicFilter: AlcoholicFilter;
  favoritesActive: boolean;
}

function readStoredFilters(): Partial<StoredFilters> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useDrinkFilters() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [drinkType, setDrinkType] = useState<string>("all");
  const [alcoholicFilter, setAlcoholicFilter] = useState<AlcoholicFilter>("all");
  const [favoritesActive, setFavoritesActive] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  // Load after mount to avoid server/client HTML mismatch
  useEffect(() => {
    const stored = readStoredFilters();
    if (stored.searchTerm !== undefined) setSearchTerm(stored.searchTerm);
    if (stored.drinkType !== undefined) setDrinkType(stored.drinkType);
    if (stored.alcoholicFilter !== undefined) setAlcoholicFilter(stored.alcoholicFilter);
    if (stored.favoritesActive !== undefined) setFavoritesActive(stored.favoritesActive);
    setHydrated(true);
  }, []);

  // Persist only after hydration so defaults don't overwrite stored values
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        FILTERS_STORAGE_KEY,
        JSON.stringify({ searchTerm, drinkType, alcoholicFilter, favoritesActive }),
      );
    } catch {}
  }, [hydrated, searchTerm, drinkType, alcoholicFilter, favoritesActive]);

  return {
    searchTerm,
    setSearchTerm,
    drinkType,
    setDrinkType,
    alcoholicFilter,
    setAlcoholicFilter,
    favoritesActive,
    setFavoritesActive,
  };
}

const ALCOHOLIC_FILTERS: { label: string; value: AlcoholicFilter }[] = [
  { label: "All", value: "all" },
  { label: "Alcoholic", value: "yes" },
  { label: "Non-alcoholic", value: "no" },
];

interface DrinkFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  drinkType: string;
  onDrinkTypeChange: (type: string) => void;
  alcoholicFilter: AlcoholicFilter;
  onAlcoholicFilterChange: (filter: AlcoholicFilter) => void;
  favoritesActive: boolean;
  onFavoritesToggle: () => void;
  activeFilterCount: number;
}

interface FilterSheetContentProps {
  drinkType: string;
  alcoholicFilter: AlcoholicFilter;
  onApply: (drinkType: string, alcoholicFilter: AlcoholicFilter) => void;
}

const FilterSheetContent: React.FC<FilterSheetContentProps> = ({
  drinkType: initialDrinkType,
  alcoholicFilter: initialAlcoholicFilter,
  onApply,
}) => {
  const [draftDrinkType, setDraftDrinkType] = useState(initialDrinkType);
  const [draftAlcoholicFilter, setDraftAlcoholicFilter] = useState(initialAlcoholicFilter);

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold text-foreground">Filters</h2>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">Type</p>
        <div className="flex flex-wrap gap-1.5">
          {drinkTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setDraftDrinkType(type.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                draftDrinkType === type.value
                  ? "bg-accent text-accent-foreground border-transparent"
                  : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">Alcohol</p>
        <div className="flex gap-1.5">
          {ALCOHOLIC_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setDraftAlcoholicFilter(f.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                draftAlcoholicFilter === f.value
                  ? "bg-accent text-accent-foreground border-transparent"
                  : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onApply(draftDrinkType, draftAlcoholicFilter)}
        className="w-full py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium transition-colors hover:bg-accent-hover"
      >
        Apply
      </button>
    </div>
  );
};

const DrinkFilters: React.FC<DrinkFiltersProps> = ({
  searchTerm,
  onSearchChange,
  drinkType,
  onDrinkTypeChange,
  alcoholicFilter,
  onAlcoholicFilterChange,
  favoritesActive,
  onFavoritesToggle,
  activeFilterCount,
}) => {
  const { showModal, hideModal } = useModal();

  const openFilterSheet = () => {
    showModal(
      <FilterSheetContent
        drinkType={drinkType}
        alcoholicFilter={alcoholicFilter}
        onApply={(type, alcoholic) => {
          onDrinkTypeChange(type);
          onAlcoholicFilterChange(alcoholic);
          hideModal();
        }}
      />,
    );
  };

  return (
    <div className="top-0 inset-x-0 z-30 bg-surface md:bg-transparent px-4 lg:px-0 py-4 box-border max-w-[860px] mx-auto border-b-[1px] border-border space-y-3">
      <TextInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search drinks..."
        delay={500}
      />

      <div className="flex gap-2">
        <button
          onClick={onFavoritesToggle}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            favoritesActive
              ? "bg-accent-subtle text-accent-text border-transparent"
              : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", favoritesActive && "fill-current")} />
          Favorites
        </button>

        <button
          onClick={openFilterSheet}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            activeFilterCount > 0
              ? "bg-surface-raised text-foreground border-border"
              : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {activeFilterCount > 0 ? `Filters · ${activeFilterCount}` : "Filters"}
        </button>
      </div>
    </div>
  );
};

export default DrinkFilters;
