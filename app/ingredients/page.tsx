"use client";
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Layout/Navigation";
import SearchCreate from "@/app/ingredients/forms/SearchCreate";
import IngredientList from "@/app/ingredients/IngredientList";
import { Ingredients } from "./models";

const Page: React.FC = () => {
  const [results, setResults] = useState<Ingredients[]>([]);

  return (
    <Navigation>
      <div>
        <div className="text-2xl font-medium">Ingredients</div>
        <SearchCreate updateResults={setResults} />
        <IngredientList ingredients={results} />
      </div>
    </Navigation>
  );
};

export default Page;
