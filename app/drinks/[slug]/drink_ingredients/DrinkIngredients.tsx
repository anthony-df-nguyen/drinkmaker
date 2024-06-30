// DrinkIngredients.tsx
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
  //form.ingredient_details.forEach((ingredient) => console.log(ingredient));

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
  }, [drinkID, ingredientOptions, enqueueSnackbar]);

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
