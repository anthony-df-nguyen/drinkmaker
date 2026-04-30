"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { useGlobalDrinkForm, DrinkFormProvider } from "./context";
import {
  AuthenticatedProvider,
  useAuthenticatedContext,
} from "@/context/Authenticated";
import { drinkTypeColors } from "../models";
import Badge from "@/components/UI/Badge";
import DrinkInstructions from "./instructions/DrinkInstructions";
import DrinkIngredients from "./drink_ingredients/DrinkIngredients";
import MartiniLoader from "@/components/UI/Loading";
import Navigation from "@/components/Layout/Navigation";
import EditDrinkForm from "./Edit/EditDrinkForm";
import { ListIngredientsProvider } from "@/app/ingredients/context/ListIngredientsContext";
import { ShareIcon, HeartIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import DeleteForm from "../forms/DeleteDrinkForm";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { thumbnailColor } from "@/utils/thumbnail";

type ImgRatio = "portrait" | "landscape" | "square" | null;

export default function Page() {
  // ✅ Read route pieces with client hooks
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const editURL = search.get("edit");

  return (
    <AuthenticatedProvider>
      <Navigation>
        <ListIngredientsProvider>
          <DrinkFormProvider slug={slug}>
            <DrinkPageContent editURL={editURL} />
          </DrinkFormProvider>
        </ListIngredientsProvider>
      </Navigation>
    </AuthenticatedProvider>
  );
}

interface DrinkPageContentProps {
  editURL: string | null;
}
const DrinkPageContent: React.FC<DrinkPageContentProps> = ({ editURL }) => {
  const { user } = useAuthenticatedContext();
  const { globalDrinkForm, loading, error } = useGlobalDrinkForm();
  const { showModal } = useModal();
  const router = useRouter();

  const [edit, setEdit] = useState(false);

  const isOwner = !!user && user.id === globalDrinkForm?.created_by_user_id;

  const handleDelete = () => router.push("/");
  const openDeleteModal = () =>
    showModal(<DeleteForm drink={globalDrinkForm} afterDelete={handleDelete} />);
  const [imgRatio, setImgRatio] = useState<ImgRatio>(null);

  useEffect(() => {
    if (
      editURL === "true" &&
      user?.id === globalDrinkForm?.created_by_user_id
    ) {
      setEdit(true);
    }
  }, [editURL, user, globalDrinkForm]);

  if (loading) return <MartiniLoader />;
  if (error) return <div>Error: {error}</div>;

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const ratio = naturalWidth / naturalHeight;
    if (ratio > 1.3) setImgRatio("landscape");
    else if (ratio < 0.8) setImgRatio("portrait");
    else setImgRatio("square");
  };

  const heroHeightClass =
    imgRatio === "portrait" ? "h-80" :
    imgRatio === "landscape" ? "h-72" :
    "h-64";

  const isLandscape = imgRatio === "landscape";

  return (
    <main>
      <div className="grid max-w-[860px] w-full mx-auto border border-border">
        {/* Hero */}
        <div className={`relative w-full ${heroHeightClass} overflow-hidden bg-surface-raised`}>
            {globalDrinkForm.picture ? (
              <>
                {/* Blur backdrop — portrait and square only */}
                {!isLandscape && (
                  <img
                    src={globalDrinkForm.picture}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl brightness-75"
                  />
                )}
                {/* Main image */}
                <img
                  src={globalDrinkForm.picture}
                  alt={globalDrinkForm.name}
                  onLoad={handleImgLoad}
                  className={`relative z-10 w-full h-full ${isLandscape ? "object-cover brightness-75" : "object-contain"}`}
                />
              </>
            ) : (
              /* Monogram fallback */
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  thumbnailColor(globalDrinkForm.name),
                )}
              >
                <span className="text-white text-8xl font-bold font-serif select-none opacity-80">
                  {globalDrinkForm.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Bottom gradient — badge, title, author */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-16 bg-gradient-to-t from-black/70 to-transparent">
              <Badge
                label={globalDrinkForm?.drink_type ?? "other"}
                color={drinkTypeColors[globalDrinkForm?.drink_type ?? "other"]}
              />
              <div className="text-2xl font-bold font-serif text-white mt-1">
                {globalDrinkForm.name}
              </div>
              <div className="text-sm text-white/60 mt-0.5 italic">
                By: {globalDrinkForm.created_by_user}
              </div>
            </div>

            {/* Top-right: share + favorite */}
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <button
                onClick={() => { /* TODO: share logic */ }}
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <ShareIcon className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => { /* TODO: favorite logic */ }}
                aria-label="Favorite"
                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <HeartIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-background p-4 border-border border-t-[1px]">
          {/* Description */}
          {!edit && globalDrinkForm.description && (
            <div className="text-sm text-muted mb-2">
              {globalDrinkForm.description}
            </div>
          )}

          {/* Owner actions */}
          {!edit && isOwner && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEdit(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-accent hover:bg-accent-hover text-accent-foreground transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit recipe
              </button>
              <button
                onClick={openDeleteModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium bg-transparent border border-border text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          {/* Recipe section */}
          {!edit && (
            <>
              <div className="mt-6 font-serif font-semibold text-foreground text-xl">Recipe</div>
              <DrinkIngredients />
            </>
          )}

          {/* Instructions */}
          {!edit && <DrinkInstructions />}
        </div>

        {/* Edit Form */}
        {edit && <EditDrinkForm setEdit={setEdit} />}
    </main>
  );
};
