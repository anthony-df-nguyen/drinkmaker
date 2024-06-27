"use client";
import React, { useState, useEffect } from "react";
import { useListIngredients } from "./context/ListIngredientsContext";
import { ListIngredientsProvider } from "./context/ListIngredientsContext";
import Navigation from "@/components/Layout/Navigation";
import SearchCreate from "@/app/ingredients/forms/SearchCreate";
import IngredientList from "@/app/ingredients/IngredientList";
import { queryAllIngredients } from "./actions";
import { IngredientsSchema } from "./models";

const Page: React.FC = () => {
  return (
    <Navigation>
      <ListIngredientsProvider>
        <div>
          <div className="text-2xl font-medium">Ingredients</div>
          <SearchCreate />
          <IngredientList />
        </div>
      </ListIngredientsProvider>
    </Navigation>
  );
};

export default Page;
