// DrinkIngredients.tsx

/**
 * `DrinkIngredients` is a React functional component that displays and manages the ingredients
 * associated with a specific drink. It allows for viewing the ingredients in a read-only mode
 * and provides an option to switch to an edit mode for modifying the ingredients list.
 *
 * Props:
 * - `drinkID`: A unique identifier for the drink whose ingredients are to be displayed and managed.
 *
 * State:
 * - `editMode`: A boolean state that determines whether the component is in edit mode, allowing
 *    for modification of the drink's ingredients.
 * - `hover`: A boolean state that tracks whether the mouse is hovering over the component, which
 *    can be used to show or hide UI elements dynamically based on user interaction.
 *
 * Hooks:
 * - `useListIngredients()`: A custom hook that fetches the list of all possible ingredients from
 *    a backend or context. It returns an object with `allIngredients`, an array of ingredient
 *    options that can be used to populate UI elements such as dropdowns or lists.
 * - `useMemo()`: React hook used to memoize the `ingredientOptions` computation. This is beneficial
 *    for performance optimization, especially if deriving `ingredientOptions` from `allIngredients`
 *    involves complex calculations or transformations.
 *
 * The component renders a UI that varies based on the `editMode` state. In read-only mode, it displays
 * the ingredients associated with the `drinkID`. In edit mode, it provides an interface for adding,
 * removing, or modifying the ingredients. The transition between these modes is typically controlled
 * by a button or similar UI element that toggles the `editMode` state.
 */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import IngredientForm from "./forms/IngredientForm";
import ReadView from "./ReadView";
import { TagOption } from "@/components/MUIInputs/Tags";
import { InsertDrinkIngredients, DrinkIngredientDetail } from "./models";
import { getDrinkIngredients } from "./actions";
import { useListIngredients } from "@/app/ingredients/context/ListIngredientsContext";
import { enqueueSnackbar } from "notistack";

interface DrinkIngredientsProps {
  drinkID: string;
}

const DrinkIngredients: React.FC<DrinkIngredientsProps> = ({ drinkID }) => {
  const [editMode, setEditMode] = useState(false);
  const [hover, setHover] = useState<boolean>(false);

  const { allIngredients } = useListIngredients();
  const ingredientOptions = useMemo(
    () =>
      allIngredients.map((ingredient) => ({
        value: ingredient.id,
        label: ingredient.name,
      })),
    [allIngredients]
  );

  const [activeSelection, setActiveSelection] = useState<TagOption[]>([]);
  const [form, setForm] = useState<InsertDrinkIngredients>({
    drink_id: drinkID,
    ingredient_details: [],
  });

  useEffect(() => {
    const fetchDrinkIngredients = async () => {
      try {
        const data = await getDrinkIngredients(drinkID);
        const currentSelection = ingredientOptions.filter((option) =>
          data
            ?.map((ingredient) => ingredient.ingredient_id)
            .includes(option.value)
        );
        setActiveSelection(currentSelection);

        if (data) {
          setForm({
            drink_id: drinkID,
            ingredient_details: data.map((ingredient) => ({
              ingredient_id: ingredient.ingredient_id,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            })),
          });
        }
      } catch (error) {
        enqueueSnackbar("Error getting drink ingredients", {
          variant: "error",
        });
      }
    };

    fetchDrinkIngredients();
  }, [drinkID, ingredientOptions]);

  
  const handleSelectedIngredient = useCallback(
    (value: TagOption[]) => {
      setActiveSelection(value);

      const updatedIngredientDetails = value.map((option) => {
        const existingDetail = form.ingredient_details.find(
          (detail) => detail.ingredient_id === option.value
        );
        return (
          existingDetail || {
            ingredient_id: option.value,
            quantity: 0,
            unit: "oz",
          }
        );
      });

      setForm((prevForm) => ({
        ...prevForm,
        ingredient_details: updatedIngredientDetails,
      }));
    },
    [form.ingredient_details]
  );

  const handleChangeUnits = useCallback((value: DrinkIngredientDetail) => {
    setForm((prevForm) => ({
      ...prevForm,
      ingredient_details: prevForm.ingredient_details.map((ingredient) =>
        // Rest of the code...
        ingredient.ingredient_id === value.ingredient_id ? value : ingredient
      ),
    }));
  }, []);

  const editView = useMemo(
    () => (
      <IngredientForm
        currentForm={form}
        ingredientOptions={ingredientOptions}
        activeSelection={activeSelection}
        handleSelectedIngredient={handleSelectedIngredient}
        handleChangeUnits={handleChangeUnits}
        handleCancel={() => setEditMode(false)}
      />
    ),
    [
      form,
      activeSelection,
      handleChangeUnits,
      handleSelectedIngredient,
      ingredientOptions,
    ]
  );

  const readView = useMemo(
    () => (
      <ReadView
        activeSelection={activeSelection}
        details={form}
        setEditMode={setEditMode}
        hover={hover}
      />
    ),
    [activeSelection, hover]
  );

  return (
    <div
      className="max-w-[1200px] w-full block mx-auto"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {editMode ? editView : readView}
    </div>
  );
};

export default DrinkIngredients;
