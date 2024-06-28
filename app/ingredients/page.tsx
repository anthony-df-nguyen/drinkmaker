"use client";
import React from "react";
import { ListIngredientsProvider } from "./context/ListIngredientsContext";
import Navigation from "@/components/Layout/Navigation";
import SearchCreate from "@/app/ingredients/forms/SearchCreate";
import IngredientList from "@/app/ingredients/IngredientList";

const Page: React.FC = () => {
  return (
    <Navigation>
      <ListIngredientsProvider>
        <div>
          <div className="pageTitle">Ingredients</div>
          <SearchCreate />
          <IngredientList />
        </div>
      </ListIngredientsProvider>
    </Navigation>
  );
};

export default Page;
