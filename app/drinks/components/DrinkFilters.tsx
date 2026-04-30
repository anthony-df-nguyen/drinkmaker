"use client";
import React from "react";
import TextInput from "@/components/UI/input";
import { cn } from "@/lib/utils";
import { drinkTypes } from "../models";

export type AlcoholicFilter = "all" | "yes" | "no";

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
}

const DrinkFilters: React.FC<DrinkFiltersProps> = ({
  searchTerm,
  onSearchChange,
  drinkType,
  onDrinkTypeChange,
  alcoholicFilter,
  onAlcoholicFilterChange,
}) => {
  return (
    <div className="top-0 inset-x-0 z-30 bg-surface px-4 lg:px-0 py-4 box-border max-w-[860px] mx-auto border-b-[1px] border-border space-y-3">
      <TextInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search drinks..."
        delay={500}
      />

      <div className="flex flex-wrap gap-1.5">
        {drinkTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onDrinkTypeChange(type.value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              drinkType === type.value
                ? "bg-accent text-accent-foreground border-transparent"
                : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5">
        {ALCOHOLIC_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onAlcoholicFilterChange(f.value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              alcoholicFilter === f.value
                ? "bg-surface-raised text-foreground border-border"
                : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DrinkFilters;
