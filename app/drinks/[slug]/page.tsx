"use client";
import React, { useState } from "react";
import { useGlobalDrinkForm, DrinkFormProvider } from "./context";
import { AuthenticatedProvider } from "@/context/Authenticated";
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
    <AuthenticatedProvider>
      <Navigation>
        <ListIngredientsProvider>
          <DrinkFormProvider slug={slug}>
            <DrinkPageContent />
          </DrinkFormProvider>
        </ListIngredientsProvider>
      </Navigation>
    </AuthenticatedProvider>
  );
};

const DrinkPageContent: React.FC = () => {
  const { globalDrinkForm, loading, error } = useGlobalDrinkForm();
  const [edit, setEdit] = useState<boolean>(false);
  if (loading) return <MartiniLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <div className="grid gap-8 max-w-[1200px] w-full mx-auto border p-4 sm:p-8 rounded-md shadow bg-white  dark:bg-stone-950 dark:border-stone-900">
        {/* Read Only */}
        {!edit && (
          <div className="flex items-start gap-2">
            {/* Content */}
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-emerald-600 ">{globalDrinkForm.name} </div>
              </div>
              <div className="text-sm mt-2 italic">
                By: {globalDrinkForm.created_by_user}
              </div>
              <div className="text-sm mt-2">{globalDrinkForm.description}</div>
              <div className="mt-2">
                <Badge
                  label={globalDrinkForm?.drink_type ?? "other"}
                  color={
                    drinkTypeColors[globalDrinkForm?.drink_type ?? "other"]
                  }
                />
              </div>
            </div>
            {/* Actions */}
            <div>
              <DrinkActionOptions
                setEdit={setEdit}
                drink={globalDrinkForm}
                drinkCreator={globalDrinkForm.created_by_user_id}
              />
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
