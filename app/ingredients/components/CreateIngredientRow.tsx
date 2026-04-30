"use client";
import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { formatText } from "@/utils/formatText";
import PleaseSignIn from "@/components/SignIn/PleaseSignIn";

interface CreateIngredientRowProps {
  name: string;
  onClick: () => void;
}

const CreateIngredientRow: React.FC<CreateIngredientRowProps> = ({ name, onClick }) => {
  const { user } = useAuthenticatedContext();
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={!user}
        className={cn(
          "w-full p-4 flex flex-row gap-4 items-center transition-colors text-left",
          !user && "opacity-20",
          user && "bg-accent-subtle hover:bg-accent-subtle/80",
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded flex items-center justify-center flex-shrink-0",
            user && "bg-accent/20",
          )}
        >
          <PlusIcon className={cn("w-5 h-5", user && "text-accent-text")} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-sm font-medium truncate",
              user && "text-accent-text",
            )}
          >
            Create &ldquo;{formatText(name)}&rdquo;
          </div>
        </div>
      </button>
      {!user && (
        <div className="px-8">
          <PleaseSignIn
            title="Create Ingredients"
            text="Sign in to contribute to the list of ingredients."
          />
        </div>
      )}
    </div>
  );
};

export default CreateIngredientRow;
