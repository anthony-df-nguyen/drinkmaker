"use client";
import { useState } from "react";
import { useGlobalDrinkForm, DrinkFormProvider } from "./context";
import DrinkBasics from "./Basics/DrinkBasics";
import DrinkInstructions from "./instructions/DrinkInstructions";
import DrinkIngredients from "./drink_ingredients/DrinkIngredients";
import MartiniLoader from "@/components/UI/Loading";
import Navigation from "@/components/Layout/Navigation";
import EditDrinkForm from "./Edit/EditDrinkForm";
import { ListIngredientsProvider } from "@/app/ingredients/context/ListIngredientsContext";

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

const DrinkPageContent = () => {
  const { globalDrinkForm, loading, error } = useGlobalDrinkForm();
  const [edit, setEdit] = useState<boolean>(true);

  if (loading) return <MartiniLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <div className="grid gap-8 max-w-[1200px] w-full mx-auto">
        {/* Read Only */}
        {!edit && <DrinkBasics />}
        {!edit && <DrinkIngredients />}
        {!edit && <DrinkInstructions />}
        {/* Edit */}
        {edit && <EditDrinkForm />}
      </div>
    </main>
  );
};

export default Page;