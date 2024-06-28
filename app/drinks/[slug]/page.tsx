"use client";
import { useState, useEffect } from "react";
import { DrinkSchema } from "../models";
import { getDrinkByID } from "../actions";
import Navigation from "@/components/Layout/Navigation";
import { enqueueSnackbar } from "notistack";
import Badge from "@/components/UI/Badge";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import EditDrinksForm from "../forms/EditDrinkForms";
import DeleteForm from "../forms/DeleteDrinkForm";

/**
 * Renders a page component for a specific post.
 * @param params - The parameters object containing the slug.
 * @param params.slug - The slug of the post.
 * @returns The rendered page component.
 */

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { showModal } = useModal();
  const [drinkData, setDrinkData] = useState<DrinkSchema | null>(null);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await getDrinkByID(slug);
        setDrinkData(data);
      };
      fetchData();
    } catch (error) {
      enqueueSnackbar(`Error loading ${slug}`, { variant: "error" });
    }
  }, [slug]);
  return (
    <Navigation>
      <main>
        {drinkData && (
          <div>
            <div className="flex items-center gap-2">
              <div className="pageTitle flex-1">{drinkData.name} </div>
              <div
                className="text-gray-500 w-8 h-8 cursor-pointer"
                onClick={() => showModal(<EditDrinksForm drink={drinkData} />)}
              >
                <PencilSquareIcon />
              </div>
              <div
                className="text-gray-500 w-8 h-8 cursor-pointer"
                onClick={() => showModal(<DeleteForm drink={drinkData} />)}
              >
                <TrashIcon />
              </div>
            </div>
            <div>
              <Badge label={drinkData.drink_type} color="bg-blue-100" />
            </div>
            <div className="mt-4">{drinkData.description}</div>
            <div className="mt-4">Drink By: {drinkData.created_by}</div>
          </div>
        )}
      </main>
    </Navigation>
  );
}
