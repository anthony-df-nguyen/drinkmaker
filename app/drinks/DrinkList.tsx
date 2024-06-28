"use client";
import React from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import Card from "@/components/UI/Card";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import DeleteForm from "./forms/DeleteDrinkForm";
import EditDrinksForm from "./forms/EditDrinkForms";
import { useRouter } from "next/navigation";
import Badge from "@/components/UI/Badge";

const DrinkList: React.FC = () => {
  const { drinksList } = useListDrinks();
  const { showModal } = useModal();
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
    </div>
  );
};

export default DrinkList;
