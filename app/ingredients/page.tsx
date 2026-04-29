"use client";
import React from "react";
import { ListIngredientsProvider } from "./context/ListIngredientsContext";
import Navigation from "@/components/Layout/Navigation";
import IngredientList from "@/app/ingredients/IngredientList";

const Page: React.FC = () => {
  return (
    <Navigation>
      <ListIngredientsProvider>
        <div className="max-w-[860px] mx-auto">
          <IngredientList />
        </div>
      </ListIngredientsProvider>
    </Navigation>
  );
};

export default Page;
