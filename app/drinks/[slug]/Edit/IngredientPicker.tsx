"use client";

import React, { useState, useEffect } from "react";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { IngredientsSchema } from "@/app/ingredients/models";
import { sanitizeInput } from "@/utils/sanitizeInput";
import checkExisting from "@/utils/supabase/checkExisting";
import { createIngredient } from "@/app/ingredients/actions";
import { formatText } from "@/utils/formatText";
import { enqueueSnackbar } from "notistack";

interface IngredientPickerProps {
  value: string;  // ingredient_id, or "" for an empty row
  allIngredients: IngredientsSchema[];
  usedIds: Set<string>;
  onChange: (id: string) => void;
  onCreated: (ingredient: IngredientsSchema) => void;
}

const IngredientPicker: React.FC<IngredientPickerProps> = ({
  value,
  allIngredients,
  usedIds,
  onChange,
  onCreated,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [inputText, setInputText] = useState(() => {
    const found = allIngredients.find((i) => i.id === value);
    return found ? formatText(found.name) : "";
  });

  // Sync display text when external value changes (e.g. after create)
  useEffect(() => {
    const found = allIngredients.find((i) => i.id === value);
    setInputText(found ? formatText(found.name) : "");
  }, [value, allIngredients]);

  // Exclude ingredients used in other rows, but keep this row's own ingredient
  const available = allIngredients.filter(
    (ing) => !usedIds.has(ing.id) || ing.id === value
  );

  // Filter manually — mode="none" so Base UI doesn't double-filter
  const filteredItems = available.filter((ing) => {
    if (!inputText) return true;
    return formatText(ing.name).toLowerCase().includes(inputText.toLowerCase());
  });

  // Only offer Create when: input is long enough AND the sanitized name
  // doesn't already exist anywhere in the full ingredient list
  const sanitizedInput = sanitizeInput(inputText);
  const exactMatch = allIngredients.some((ing) => ing.name === sanitizedInput);
  const showCreate = inputText.trim().length >= 2 && !exactMatch;

  const handleCreate = async () => {
    if (!sanitizedInput) return;
    setIsCreating(true);
    try {
      const exists = await checkExisting("ingredients", "name", sanitizedInput);
      if (exists) {
        enqueueSnackbar(
          `"${formatText(sanitizedInput)}" already exists — select it from the list`,
          { variant: "warning" }
        );
        return;
      }
      const created = await createIngredient({ name: sanitizedInput });
      const newIngredient = created[0];
      onCreated(newIngredient);
      onChange(newIngredient.id);
    } catch {
      enqueueSnackbar("Failed to create ingredient", { variant: "error" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Autocomplete.Root
      // mode="none" — we handle filtering ourselves via filteredItems
      // Empty then correctly fires when filteredItems.length === 0
      mode="none"
      value={inputText}
      onValueChange={(text: string) => {
        setInputText(text);
        if (!text) onChange("");
      }}
      items={filteredItems}
      itemToStringValue={(ing: IngredientsSchema) => formatText(ing.name)}
      disabled={isCreating}
      openOnInputClick
    >
      <Autocomplete.InputGroup className="flex h-10 w-full items-center gap-1.5 rounded-md border border-border bg-surface-raised pl-3 pr-2 text-sm transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/50">
        <Autocomplete.Input
          placeholder="Search or create…"
          className="flex-1 bg-transparent text-foreground placeholder:text-subtle outline-none text-sm min-w-0"
        />
        <ChevronDownIcon className="size-4 text-muted pointer-events-none shrink-0" />
      </Autocomplete.InputGroup>

      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4} className="isolate z-50 w-[var(--anchor-width)]">
          <Autocomplete.Popup className="rounded-md bg-surface shadow-md ring-1 ring-border overflow-hidden">
            <Autocomplete.List className="max-h-60 overflow-y-auto p-1">
              {filteredItems.map((ing) => (
                <Autocomplete.Item
                  key={ing.id}
                  value={ing}
                  onClick={() => onChange(ing.id)}
                  className="relative flex w-full cursor-default items-center rounded-md py-1.5 pl-2 pr-8 text-sm text-foreground outline-none select-none data-[highlighted]:bg-surface-raised"
                >
                  {formatText(ing.name)}
                  {ing.id === value && (
                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                      <CheckIcon className="size-3.5 text-accent-text" />
                    </span>
                  )}
                </Autocomplete.Item>
              ))}

              {/* Empty only renders its children when items.length === 0.
                  Always keep the element mounted (Base UI a11y requirement). */}
              <Autocomplete.Empty className="px-3 py-2 text-sm">
                {showCreate ? (
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="w-full text-left text-accent-text hover:underline disabled:opacity-50"
                  >
                    {isCreating ? "Creating…" : `Create "${inputText}"`}
                  </button>
                ) : (
                  <span className="text-muted">No ingredients found</span>
                )}
              </Autocomplete.Empty>
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
};

export default IngredientPicker;
