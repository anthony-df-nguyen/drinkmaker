"use client";
import React, { useState, useEffect } from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import Card from "@/components/UI/Card";
import { useRouter } from "next/navigation";
import Pagination from "@/components/UI/Pagination";
import Badge from "@/components/UI/Badge";
import { queryDrinks } from "./actions";
import { drinkTypeColors, drinkTypes } from "./models";

import TextInput from "@/components/Inputs/TextInput";
import Select from "@/components/Inputs/Select";

const DrinkList: React.FC = () => {
  const { drinksList, setDrinksList, count, setCount } = useListDrinks();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, handleSearchTermChange] = useState<string>("");
  const [selectDrinkType, setSelectDrinkType] = useState<string | undefined>(
    undefined
  );
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    try {
      queryDrinks(currentPage, 10, searchTerm, selectDrinkType).then((data) => {
        setDrinksList(data.data);
        setCount(data.totalCount);
      });
    } catch (error) {
      console.error("Error querying ingredients: ", error);
    }
  }, [currentPage, searchTerm, selectDrinkType]);

  const router = useRouter();

  return (
    <div className="mt-4 grid gap-2">
      {/* Controls */}
      <div className="lg:flex gap-4 mb-4">
        <div className="w-full lg:w-[300px]">
          <TextInput
            label="Search for Drink"
            placeholder="Drink Name"
            onChange={(e) => handleSearchTermChange(e)}
            id="search-drinks"
            type="text"
            value={searchTerm}
          />
        </div>
        <div className="lg:w-[200px]">
          <Select
            label="Drink Type"
            options={drinkTypes}
            defaultValue={"All"}
            onChange={(e) => setSelectDrinkType(e)}
          />
        </div>
      </div>
      {/* Grid/Results */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 ">
        {drinksList.map((drink) => {
          const color = drinkTypeColors[drink.drink_type];
          return (
            <Card
              key={drink.unique_name}
              className={"cursor-pointer"}
              onClick={() => {
                router.push(`/drinks/${drink.unique_name}`);
              }}
            >
              <div className="flex items-center gap-2 justify-between w-full">
                <div>
                  <div className="text-base">{drink.name}</div>
                  <div className="text-sm font-light">{drink.description}</div>
                  <div className="mt-2">
                    <Badge label={drink.drink_type} color={color} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Pagination
        totalItems={count}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DrinkList;
