"use client";
import { useState, useEffect, useCallback } from "react";
import ViewOnlyMode from "./ViewMode";
import EditDrinkForm from "../forms/EditDrinkForm";
import { DrinkSchema, drinkTypeColors } from "../models";
import { getDrinkByID } from "../actions";
import Navigation from "@/components/Layout/Navigation";
import { enqueueSnackbar } from "notistack";
import Badge from "@/components/UI/Badge";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import DeleteForm from "../forms/DeleteDrinkForm";
import { useRouter } from "next/navigation";
import { ListIngredientsProvider } from "@/app/ingredients/context/ListIngredientsContext";

/**
 * Renders the page for a specific drink.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters object containing the drink slug.
 * @param {string} props.params.slug - The slug of the drink.
 * @returns {JSX.Element} The rendered page component.
 */
const Page: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;
  const { showModal } = useModal();
  const [drinkData, setDrinkData] = useState<DrinkSchema>();
  const [editMode, setEditMode] = useState<boolean>(true);

  const router = useRouter();

  /**
   * Fetches drink data by ID and updates the state with the fetched data.
   * If an error occurs, it displays a snackbar with an error message.
   */
  const fetchData = useCallback(async () => {
    try {
      const data = await getDrinkByID(slug);
      setDrinkData(data);
    } catch (error) {
      enqueueSnackbar(`Error loading ${slug}`, { variant: "error" });
    }
  }, [slug]);

  // Fetch data on mount and when edit mode is toggled
  useEffect(() => {
    fetchData();
  }, [fetchData, editMode]);

  const renderContent = () => {
    return (
      drinkData && (
        <div>
          <div>
            <div className="flex items-center gap-2">
              <div className=" flex-1">
                <div className="pageTitle mb-2">{drinkData.name}</div>
                <Badge
                  label={drinkData.drink_type}
                  color={drinkTypeColors[drinkData.drink_type]}
                />
              </div>
              {!editMode && (
                <div
                  className="text-gray-500 w-8 h-8 cursor-pointer"
                  onClick={() => setEditMode(true)}
                >
                  <PencilSquareIcon />
                </div>
              )}
              {!editMode && (
                <div
                  className="text-gray-500 w-8 h-8 cursor-pointer"
                  onClick={() =>
                    showModal(
                      <DeleteForm
                        drink={drinkData}
                        afterDelete={() => {
                          console.log("Should redirect");
                          router.push("/");
                        }}
                      />
                    )
                  }
                >
                  <TrashIcon />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            {!editMode && <ViewOnlyMode drink={drinkData} />}
            {editMode && (
              <EditDrinkForm
                drink={drinkData}
                handleCancel={() => setEditMode(false)}
              />
            )}
          </div>
        </div>
      )
    );
  };

  return (
    <Navigation>
      <ListIngredientsProvider>
        {" "}
        <main>{renderContent()}</main>
      </ListIngredientsProvider>
    </Navigation>
  );
};

export default Page;
