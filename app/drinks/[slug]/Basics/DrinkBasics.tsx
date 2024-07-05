"use client";
import { useGlobalDrinkForm } from "../context";
import { DrinkSchema, drinkTypeColors } from "../../models";
import Badge from "@/components/UI/Badge";
import { useRouter } from "next/navigation";

const DrinkBasics: React.FC = () => {
  const router = useRouter();
  const { globalDrinkForm } = useGlobalDrinkForm();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="pageTitle">{globalDrinkForm?.name} </div>
      </div>
      <div className="text-sm">{globalDrinkForm?.description}</div>
      <Badge
        label={globalDrinkForm?.drink_type ?? "other"}
        color={drinkTypeColors[globalDrinkForm?.drink_type ?? "other"]}
      />
    </div>
  );
};

export default DrinkBasics;
