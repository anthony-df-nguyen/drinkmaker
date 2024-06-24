"use client";
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Layout/Navigation";
import IngredientForm from "@/app/ingredients/IngredientsForm";
import IngredientList from "@/app/ingredients/IngredientList";
import { Ingredients } from "@/schema/ingredients";
import { useSupabase } from "@/context/Supabase";
import { enqueueSnackbar } from "notistack";

const Page: React.FC = () => {
  const [results, setResults] = useState<Ingredients[]>([]);
  const pg = useSupabase();

  const queryAll = async () => {
    const { data, error, status } = await pg.from("ingredients").select("name");
    if (status === 200 && data) {
      setResults(data);
    } else if (error) {
      console.error("Error fetching ingredients:", error);
      enqueueSnackbar("Error searching for ingredients", { variant: "error" });
    }
  };

  const query = async (currentValue: string) => {
    const { data, error } = await pg
      .from("ingredients")
      .select("name")
      .ilike("name", `%${currentValue}%`);
    if (error) {
      console.error("Error fetching ingredient:", error);
      enqueueSnackbar(`Error searching for ingredient ${currentValue}`, {
        variant: "error",
      });
    } else {
      setResults(data);
    }
  };

  useEffect(() => {
    queryAll();
  }, []);

  return (
    <Navigation>
      <div>
        <h1>Search for Ingredients</h1>
        <IngredientForm onSuccess={queryAll} onChange={query}/>
        <IngredientList ingredients={results} />
      </div>
    </Navigation>
  );
};

export default Page;
