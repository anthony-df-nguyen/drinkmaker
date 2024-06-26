"use client";
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Layout/Navigation";
import IngredientForm from "@/app/ingredients/IngredientsForm";
import IngredientList from "@/app/ingredients/IngredientList";
import { Ingredients } from "./models";

const Page: React.FC = () => {
  const [results, setResults] = useState<Ingredients[]>([]);


  // useEffect(() => {
  //   const fetchIngredients = async () => {
  //     try {
  //       await queryAllIngredients().then((data) => {
  //         setResults(data);
  //       });
  //     } catch (error) {
  //       console.error("Failed to fetch ingredients:", error);
  //       enqueueSnackbar("Could not fetch all ingredients", {
  //         variant: "error",
  //       });
  //     }
  //   };
  //   fetchIngredients();
  //   return () => {};
  // }, []);

  return (
    <Navigation>
      <div>
        <div className="text-2xl font-medium">Ingredients</div>
        <IngredientForm updateResults={setResults} />
        <IngredientList ingredients={results} />
      </div>
    </Navigation>
  );
};

export default Page;
