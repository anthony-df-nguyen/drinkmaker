"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { useGlobalDrinkForm, DrinkFormProvider } from "./context";
import {
  AuthenticatedProvider,
  useAuthenticatedContext,
} from "@/context/Authenticated";
import { drinkTypeColors } from "../models";
import Badge from "@/components/UI/Badge";
import DrinkInstructions from "./instructions/DrinkInstructions";
import DrinkIngredients from "./drink_ingredients/DrinkIngredients";
import MartiniLoader from "@/components/UI/Loading";
import Navigation from "@/components/Layout/Navigation";
import EditDrinkForm from "./Edit/EditDrinkForm";
import { ListIngredientsProvider } from "@/app/ingredients/context/ListIngredientsContext";
import DrinkActionOptions from "./DrinkActionOptions";

export default function Page() {
  // ✅ Read route pieces with client hooks
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const editURL = search.get("edit");

  return (
    <AuthenticatedProvider>
      <Navigation>
        <ListIngredientsProvider>
          <DrinkFormProvider slug={slug}>
            <DrinkPageContent editURL={editURL} />
          </DrinkFormProvider>
        </ListIngredientsProvider>
      </Navigation>
    </AuthenticatedProvider>
  );
}

interface DrinkPageContentProps {
  editURL: string | null;
}
const DrinkPageContent: React.FC<DrinkPageContentProps> = ({ editURL }) => {
  const { user } = useAuthenticatedContext();
  const { globalDrinkForm, loading, error } = useGlobalDrinkForm();

  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (
      editURL === "true" &&
      user?.id === globalDrinkForm?.created_by_user_id
    ) {
      setEdit(true);
    }
  }, [editURL, user, globalDrinkForm]);

  if (loading) return <MartiniLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <div className="mt-4 grid gap-8 max-w-[860px] w-full mx-auto border p-4 sm:p-8 rounded-md shadow-sm bg-white dark:bg-stone-800 dark:border-0">
        {!edit && (
          <div className="flex items-start gap-2">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-emerald-600 dark:text-white ">
                  {globalDrinkForm.name}{" "}
                </div>
              </div>
              <div className="text-sm mt-2 italic dark:text-gray-500">
                By: {globalDrinkForm.created_by_user}
              </div>
              <div className="text-sm mt-2 dark:text-gray-300">
                {globalDrinkForm.description}
              </div>
              <div className="mt-2">
                <Badge
                  label={globalDrinkForm?.drink_type ?? "other"}
                  color={drinkTypeColors[globalDrinkForm?.drink_type ?? "other"]}
                />
              </div>
            </div>

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

        {edit && <EditDrinkForm setEdit={setEdit} />}
      </div>
    </main>
  );
};
