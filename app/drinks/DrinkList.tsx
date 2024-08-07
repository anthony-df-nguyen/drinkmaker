"use client";
import React, { useState, useEffect } from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import Link from "next/link";
import Card from "@/components/UI/Card";
import { useRouter } from "next/navigation";
import Pagination from "@/components/UI/Pagination";
import Badge from "@/components/UI/Badge";
import { queryDrinks } from "./actions";
import { drinkTypeColors, drinkTypes } from "./models";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";

const DrinkList: React.FC = () => {
  const { drinksList, setDrinksList, count, setCount } = useListDrinks();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, handleSearchTermChange] = useState<string>("");
  const [selectDrinkType, setSelectDrinkType] = useState<string>("all");
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
      <div className="flex flex-row gap-4 mb-4">
        <div className="w-[240px] md:w-[300px]">
          <DebouncedTextInput
            label="Search for Drink"
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e)}
            placeholder="Drink Name"
            delay={500}
            variant="filled"
            size="small"
          />
        </div>
        <div className="flex-1 sm:flex-none sm:w-[200px] max-w-[200px]">
          <CustomSelect
            label="Drink Type"
            options={drinkTypes}
            value={selectDrinkType}
            onChange={(e) => setSelectDrinkType(e)}
            variant="filled"
            size="small"
          />
        </div>
      </div>
      {/* Grid/Results */}
      <Pagination
        totalItems={count}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      <div className="grid gap-4 xl:grid-cols-1 ">
        {drinksList.map((drink) => {
          const color = drinkTypeColors[drink.drink_type];
          return (
            <Link key={drink.unique_name} href={`/drinks/${drink.unique_name}`}>
              <Card className="w-full h-full">
                <div className="flex flex-col gap-2 justify-start h-full">
                  <div className="text-base text-gray-900 dark:text-white">{drink.name}</div>
                  <div className="text-xs italic font-light text-gray-500">
                    By: {drink.profiles.username ?? "Unknown Creator"}
                  </div>
                  <div className="text-xs font-light text-gray-700 dark:text-gray-300 flex-1">
                    {drink.description}
                  </div>
                  <div>
                    <Badge label={drink.drink_type} color={color} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
     
    </div>
  );
};

export default DrinkList;
