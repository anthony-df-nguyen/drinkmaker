"use client";

import React, { useState, useCallback } from "react";
import { useGlobalDrinkForm } from "../context";
import { useListIngredients } from "@/app/ingredients/context/ListIngredientsContext";
import { drinkTypeFormOptions, alcoholicOptions, encodeAlcoholic, decodeAlcoholic } from "../../models";
import TextInput from "@/components/UI/input";
import TextArea from "@/components/UI/textarea";
import CustomSelect from "@/components/UI/select";
import NumberInput from "@/components/MUIInputs/NumberInput";
import { Button } from "@/components/UI/Button";
import Editor from "../instructions/editor/Editor";
import { measuringUnits } from "../drink_ingredients/constants";
import classNames from "@/utils/classNames";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import IngredientPicker from "./IngredientPicker";
import { IngredientsSchema } from "@/app/ingredients/models";

const ROLES = ["required", "optional", "garnish"] as const;

type Props = {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditDrinkForm({ setEdit }: Props) {
  const { allIngredients, setAllIngredients } = useListIngredients();
  const { globalDrinkForm, setGlobalDrinkForm, setFormSubmitted } =
    useGlobalDrinkForm();

  const [liveFormState, setLiveFormState] = useState(globalDrinkForm);

  const [quillEditorContent, setQuillEditorContent] = useState<string>(
    liveFormState.instructions ?? "",
  );

  const handleChange = useCallback((key: string, value: any) => {
    setLiveFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleChangeIngredientField = (
    value: string | number,
    index: number,
    key: "ingredient_id" | "unit" | "quantity" | "role",
  ) => {
    const updatedIngredients = liveFormState.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [key]: value } : ingredient,
    );
    handleChange("ingredients", updatedIngredients);
  };

  const addIngredient = () => {
    handleChange("ingredients", [
      ...liveFormState.ingredients,
      { ingredient_id: "", quantity: 0, unit: "oz", role: "required" },
    ]);
  };

  const removeIngredient = (index: number) => {
    handleChange(
      "ingredients",
      liveFormState.ingredients.filter((_, i) => i !== index),
    );
  };

  const handleIngredientCreated = (ingredient: IngredientsSchema) => {
    setAllIngredients((prev) => [...prev, ingredient]);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormState = {
      ...liveFormState,
      instructions: quillEditorContent,
      ingredients: liveFormState.ingredients.filter((ing) => ing.ingredient_id),
    };
    setLiveFormState(updatedFormState);
    setGlobalDrinkForm(updatedFormState);
    setFormSubmitted(true);
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-4 lg:p-6 space-y-8">
      {/* ── Drink Details ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
          Drink Details
        </h2>
        <TextInput
          label="Name"
          value={liveFormState.name}
          onChange={(value) => handleChange("name", value || "")}
          required
          errorText="Name is required"
          error={!liveFormState.name}
          delay={500}
        />
        <TextArea
          label="Description"
          value={liveFormState.description}
          onChange={(value) => handleChange("description", value || "")}
          errorText="Description is too long"
          error={liveFormState.description.length > 250}
          rows={3}
        />
        <div className="grid grid-cols-1 gap-4">
          <CustomSelect
            label="Drink Type"
            required
            options={drinkTypeFormOptions}
            value={liveFormState.drink_type}
            onChange={(value) => handleChange("drink_type", value)}
          />
          <CustomSelect
            label="Alcoholic?"
            options={alcoholicOptions}
            value={encodeAlcoholic(liveFormState.is_alcoholic)}
            onChange={(value: string) => handleChange("is_alcoholic", decodeAlcoholic(value as "true" | "false"))}
          />
          <TextInput
            label="Image URL"
            value={liveFormState.picture ?? ""}
            onChange={(value) => handleChange("picture", value || "")}
            delay={500}
          />
          <div className="-mt-1 text-sm text-muted font-medium">
            Tip: Using a landscape photo will look nicer.
          </div>
        </div>
      </section>

      {/* ── Ingredients ── */}
      <section className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
            Ingredients
          </h2>
          {liveFormState.ingredients.length === 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
            >
              <PlusIcon />
              Add ingredient
            </Button>
          )}
        </div>

        {liveFormState.ingredients.length === 0 && (
          <p className="text-sm text-muted italic">No ingredients added yet.</p>
        )}

        <div className="space-y-2">
          {liveFormState.ingredients.map((ingredient, index) => {
            const usedIds = new Set(
              liveFormState.ingredients
                .filter((_, i) => i !== index)
                .map((ing) => ing.ingredient_id)
                .filter(Boolean),
            );

            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-surface p-3 space-y-3"
              >
                {/* Ingredient picker + remove button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <IngredientPicker
                      value={ingredient.ingredient_id}
                      allIngredients={allIngredients}
                      usedIds={usedIds}
                      onChange={(id) =>
                        handleChangeIngredientField(id, index, "ingredient_id")
                      }
                      onCreated={handleIngredientCreated}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeIngredient(index)}
                    aria-label="Remove ingredient"
                  >
                    <XMarkIcon />
                  </Button>
                </div>

                {/* Quantity + Unit */}
                <div className="flex items-end gap-2">
                  <div className="w-28 shrink-0">
                    <NumberInput
                      label="Quantity"
                      value={ingredient.quantity}
                      onChange={(value) =>
                        handleChangeIngredientField(value, index, "quantity")
                      }
                      required
                      min={0}
                    />
                  </div>
                  <div className="flex-1">
                    <CustomSelect
                      label="Unit"
                      value={ingredient.unit}
                      onChange={(value) =>
                        handleChangeIngredientField(value, index, "unit")
                      }
                      options={measuringUnits}
                    />
                  </div>
                </div>

                {/* Role pills */}
                <div className="flex items-center gap-1.5">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        handleChangeIngredientField(role, index, "role")
                      }
                      className={classNames(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize",
                        ingredient.role === role
                          ? "bg-accent text-accent-foreground border-transparent"
                          : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {liveFormState.ingredients.length > 0 && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className={""}
            >
              <PlusIcon />
              Add ingredient
            </Button>
          </div>
        )}
      </section>

      {/* ── Instructions ── */}
      <section className="space-y-4 border-t border-border pt-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
          Instructions
        </h2>
        <Editor
          initialContent={globalDrinkForm.instructions}
          onChangeHandler={(content) => setQuillEditorContent(content)}
        />
      </section>

      {/* ── Actions ── */}
      <div className="flex gap-2 justify-end border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => setEdit(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Save recipe
        </Button>
      </div>
    </form>
  );
}
