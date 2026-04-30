"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { DrinkIngredientViewData } from "./models";
import { VOLUME_UNITS, VolumeUnit } from "./utils";
import { cn } from "@/lib/utils";

interface DropdownState {
  index: number;
  top: number;
  left: number;
}

interface IngredientTableProps {
  data: DrinkIngredientViewData[];
  onUnitSelect: (index: number, unit: VolumeUnit) => void;
}

const ROLE_ORDER: Record<string, number> = { required: 0, optional: 1, garnish: 2 };

const IngredientTable: React.FC<IngredientTableProps> = ({
  data,
  onUnitSelect,
}) => {
  const [dropdown, setDropdown] = useState<DropdownState | null>(null);

  const sortedData = [...data]
    .map((row, originalIndex) => ({ row, originalIndex }))
    .sort((a, b) => (ROLE_ORDER[a.row.role] ?? 1) - (ROLE_ORDER[b.row.role] ?? 1));

  useEffect(() => {
    if (!dropdown) return;
    const close = () => setDropdown(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [dropdown]);

  const openDropdown = (
    originalIndex: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (dropdown?.index === originalIndex) {
      setDropdown(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdown({ index: originalIndex, top: rect.bottom + 4, left: rect.left });
  };

  const handleUnitSelect = (index: number, unit: VolumeUnit) => {
    onUnitSelect(index, unit);
    setDropdown(null);
  };

  return (
    <>
      <div className="mt-4 rounded-lg overflow-hidden bg-surface divide-y divide-border border border-border ">
        {sortedData.map(({ row, originalIndex }, i) => (
          // Each Row
          <div
            key={originalIndex}
            className={cn(
              "px-4 py-4",
              i % 2 === 1 ? "bg-background" : "",
            )}
          >
            <div className="flex items-center gap-2 justify-between">
              <div>
                <div className="text-foreground text-sm">{row.name}</div>
                {row.role !== "required" && (
                  <div className="text-xs text-muted italic">{row.role}</div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-foreground font-semibold text-sm">
                  {row.displayQty}
                </div>
                {row.isVolumeUnit ? (
                  <button
                    type="button"
                    onClick={(e) => openDropdown(originalIndex, e)}
                    className={cn(
                      "flex w-12 items-center justify-end gap-0.5 rounded px-2 py-0.5 text-foreground text-sm ring-1 ring-border bg-background hover:bg-surface-raised transition-colors",
                      dropdown?.index === originalIndex ? "ring-accent-text ring-2" : "",
                    )}
                  >
                    {row.displayUnit}
                    <ChevronDownIcon className="w-3 h-3 text-muted" />
                  </button>
                ) : (
                  <span className="text-foreground text-sm px-1 font-medium w-12">
                    {row.displayUnit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dropdown &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdown(null)}
            />
            <div
              className="fixed z-50 w-20 rounded-md bg-surface shadow-lg ring-1 ring-border"
              style={{ top: dropdown.top, left: dropdown.left }}
            >
              {VOLUME_UNITS.map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => handleUnitSelect(dropdown.index, unit)}
                  className={cn(
                    "block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-raised",
                    data[dropdown.index].displayUnit === unit
                      ? "font-medium text-accent-text"
                      : "text-foreground",
                  )}
                >
                  {unit}
                </button>
              ))}
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

export default IngredientTable;
