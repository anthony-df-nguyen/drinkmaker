"use client";
import React, { useState } from "react";
import { useGlobalDrinkForm, DrinkFormProvider } from "./context";
import { drinkTypeColors } from "../models";
import Badge from "@/components/UI/Badge";
import DrinkInstructions from "./instructions/DrinkInstructions";
import DrinkIngredients from "./drink_ingredients/DrinkIngredients";
import MartiniLoader from "@/components/UI/Loading";
import Navigation from "@/components/Layout/Navigation";
import EditDrinkForm from "./Edit/EditDrinkForm";
import { ListIngredientsProvider } from "@/app/ingredients/context/ListIngredientsContext";
import DrinkActionOptions from "./DrinkActionOptions";

const Page: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;

  return (
    <Navigation>
      <ListIngredientsProvider>
        <DrinkFormProvider slug={slug}>
          <DrinkPageContent />
        </DrinkFormProvider>
      </ListIngredientsProvider>
    </Navigation>
  );
};

const DrinkPageContent: React.FC = () => {
  const { globalDrinkForm, loading, error } = useGlobalDrinkForm();
  const [edit, setEdit] = useState<boolean>(false);

  if (loading) return <MartiniLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <div className="grid gap-8 max-w-[1200px] w-full mx-auto">
        {/* Read Only */}
        {!edit && (
          <div className="flex items-start gap-2">
            {/* Content */}
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="pageTitle">{globalDrinkForm.name} </div>
              </div>
              <div className="text-sm">{globalDrinkForm.description}</div>
              <Badge
                label={globalDrinkForm?.drink_type ?? "other"}
                color={drinkTypeColors[globalDrinkForm?.drink_type ?? "other"]}
              />
            </div>
            {/* Actions */}
            <div>
              <DrinkActionOptions setEdit={setEdit} />
            </div>
          </div>
        )}
        {!edit && <DrinkIngredients />}
        {!edit && <DrinkInstructions />}
        {/* Edit */}
        {edit && <EditDrinkForm setEdit={setEdit} />}
      </div>
    </main>
  );
};

export default Page;