"use client";
import React, { useState } from "react";
import { useGlobalDrinkForm } from "../context";
import { DrinkIngredientViewData } from "./models";
import { formatText } from "@/utils/formatText";
import IngredientTable from "./IngredientTable";
import { useListIngredients } from "@/app/ingredients/context/ListIngredientsContext";
import {
  VOLUME_UNITS,
  VolumeUnit,
  toTsp,
  fromTsp,
  smartUnit,
  formatQty,
} from "./utils";

const ReadView: React.FC = () => {
  const { globalDrinkForm } = useGlobalDrinkForm();
  const { allIngredients } = useListIngredients();

  const [multiplier, setMultiplier] = useState<number>(1);
  const [smartScale] = useState<boolean>(false);
  const [overrides, setOverrides] = useState<Record<number, VolumeUnit>>({});

  const findIngredientLabelByValue = (value: string): string => {
    const ingredient = allIngredients.find((option) => option.id === value);
    return formatText(ingredient?.name ?? "") ?? "";
  };

  const changeMultiplier = (direction: "up" | "down") => {
    setOverrides({});
    if (direction === "up") setMultiplier((m) => m + 1);
    if (direction === "down") setMultiplier((m) => m - 1);
  };

  const handleUnitSelect = (index: number, unit: VolumeUnit) => {
    const ing = globalDrinkForm?.ingredients?.[index];
    if (!ing) return;
    const tspTotal = toTsp(ing.quantity * multiplier, ing.unit as VolumeUnit);
    const autoUnit = smartScale
      ? smartUnit(tspTotal)
      : (ing.unit as VolumeUnit);
    if (unit === autoUnit) {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    } else {
      setOverrides((prev) => ({ ...prev, [index]: unit }));
    }
  };

  const ingredients = globalDrinkForm?.ingredients ?? [];

  const data: DrinkIngredientViewData[] = ingredients.map((ing, index) => {
    const isVolumeUnit = (VOLUME_UNITS as readonly string[]).includes(ing.unit);
    if (isVolumeUnit) {
      const tspTotal = toTsp(ing.quantity * multiplier, ing.unit as VolumeUnit);
      const isOverridden = index in overrides;
      const displayUnit = isOverridden
        ? overrides[index]
        : smartScale
          ? smartUnit(tspTotal)
          : (ing.unit as VolumeUnit);
      return {
        name: findIngredientLabelByValue(ing.ingredient_id),
        quantity: ing.quantity,
        unit: ing.unit,
        role: ing.role,
        displayQty: formatQty(fromTsp(tspTotal, displayUnit)),
        displayUnit,
        isVolumeUnit: true,
        isOverridden,
      };
    }
    return {
      name: findIngredientLabelByValue(ing.ingredient_id),
      quantity: ing.quantity,
      unit: ing.unit,
      role: ing.role,
      displayQty: formatQty(ing.quantity * multiplier),
      displayUnit: ing.unit,
      isVolumeUnit: false,
      isOverridden: false,
    };
  });

  return (
    <div className="mt-4 w-full">
      {data.length > 0 && (
        <div className="">
          <div className="flex items-center justify-between">
            <div className="font-serif font-semibold">Servings</div>
            <span className="flex items-center gap-4">
              <button
                type="button"
                disabled={multiplier === 1}
                onClick={() => changeMultiplier("down")}
                className="relative inline-flex items-center rounded-full px-4 py-2 text-foreground ring-1 ring-inset ring-border hover:bg-surface-raised focus:z-10"
              >
                <span className="sr-only">Previous</span>-
              </button>
              <div className="relative inline-flex items-center text-sm font-bold text-foreground">
                {multiplier}
              </div>
              <button
                type="button"
                onClick={() => changeMultiplier("up")}
                className="relative inline-flex items-center rounded-full px-4 py-2 text-foreground ring-1 ring-inset ring-border hover:bg-surface-raised focus:z-10"
              >
                <span className="sr-only">Next</span>+
              </button>
            </span>
          </div>
        </div>
      )}

      <IngredientTable data={data} onUnitSelect={handleUnitSelect} />
    </div>
  );
};

export default ReadView;
