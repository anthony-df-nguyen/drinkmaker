"use client";
import React, {useState, useEffect} from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import Card from "@/components/UI/Card";
import { useRouter } from "next/navigation";
import Pagination from "@/components/UI/Pagination";
import Badge from "@/components/UI/Badge";
import { queryDrinks } from "./actions";

const DrinkList: React.FC = () => {
  const { drinksList, setDrinksList, count } = useListDrinks();
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    try {
      queryDrinks(currentPage, 10).then((data) => setDrinksList(data));
    } catch (error) {
      console.error("Error querying ingredients: ", error);
    }
  }, [currentPage, setDrinksList])
  const router = useRouter();
  return (
    <div className="mt-8 grid gap-2">
      {drinksList.map((drink) => (
        <Card
          key={drink.unique_name}
          className={"cursor-pointer"}
          onClick={() => {
            router.push(`/drinks/${drink.unique_name}`);
          }}
        >
          <div className="flex items-center gap-2 justify-between w-full">
            <div>
              <div className="text-md">{drink.name}</div>
              <div className="text-sm font-light">{drink.description}</div>
              <div className="mt-2">
                <Badge label={drink.drink_type} color="bg-blue-100" />
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Pagination totalItems={count} itemsPerPage={10} currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};

export default DrinkList;
