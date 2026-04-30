"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useListIngredients } from "./context/ListIngredientsContext";
import { formatText } from "@/utils/formatText";
import {
  queryIngredients,
  createIngredient,
  searchForIngredient,
} from "./actions";
import { sanitizeInput, validateInput } from "@/utils/sanitizeInput";
import checkExisting from "@/utils/supabase/checkExisting";
import { enqueueSnackbar } from "notistack";
import TextInput from "@/components/UI/input";
import IngredientRow from "./components/IngredientRow";
import CreateIngredientRow from "./components/CreateIngredientRow";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const PAGE_SIZE = 10;

const IngredientList: React.FC = () => {
  const {
    ingredients,
    setIngredients,
    count,
    mode,
    setMode,
    refreshBrowseFirstPage,
  } = useListIngredients();

  const [searchTerm, setSearchTerm] = useState("");
  const [cleanTerm, setCleanTerm] = useState("");
  const [enableCreate, setEnableCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchRequestRef = useRef(0);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || mode !== "browse") return;
    const nextPage = page + 1;
    setIsLoading(true);
    try {
      const { data } = await queryIngredients(nextPage, PAGE_SIZE);
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      setIngredients((prev) => {
        const existing = new Set(prev.map((i) => i.name));
        return [...prev, ...data.filter((i) => !existing.has(i.name))];
      });
      setPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      // handled silently
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, mode, page, setIngredients]);

  const lastIngredientRef = useIntersectionObserver(loadMore, isLoading);

  useEffect(() => {
    if (mode === "browse") {
      setPage(1);
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [mode]);

  const handleSearch = useCallback(
    async (val: string) => {
      const requestId = ++searchRequestRef.current;
      const clean = sanitizeInput(val);
      const valid = validateInput(clean, { minLength: 3 });

      setSearchTerm(val);
      setCleanTerm(clean);

      if (!valid.isValid) {
        setEnableCreate(false);
        if (clean.length === 0) {
          setMode("browse");
          refreshBrowseFirstPage().catch(() => {});
        }
        return;
      }

      try {
        setMode("search");
        const data = await searchForIngredient(clean);
        if (searchRequestRef.current !== requestId) return;
        setIngredients(data);

        const exists = await checkExisting("ingredients", "name", clean);
        if (searchRequestRef.current !== requestId) return;
        setEnableCreate(!exists);
      } catch {
        enqueueSnackbar("Could not search ingredients", { variant: "error" });
      }
    },
    [setIngredients, setMode, refreshBrowseFirstPage],
  );

  const handleCreate = async () => {
    if (!enableCreate || isCreating) return;
    setIsCreating(true);
    try {
      await createIngredient({ name: cleanTerm });
      enqueueSnackbar(`"${formatText(cleanTerm)}" added`, {
        variant: "success",
      });
      setSearchTerm("");
      setCleanTerm("");
      setEnableCreate(false);
      await refreshBrowseFirstPage();
    } catch {
      enqueueSnackbar("Could not add ingredient", { variant: "error" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="top-0 inset-x-0 z-30 bg-surface px-4 lg:px-0 py-4 border-b border-border">
        <TextInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search or add an ingredient..."
          delay={600}
        />
      </div>

      <div className="grid gap-0 divide-y divide-border max-h-[80vh] overflow-auto">
        {enableCreate && cleanTerm.length >= 3 && (
          <CreateIngredientRow name={cleanTerm} onClick={handleCreate} />
        )}

        {ingredients.map((ingredient, index) => {
          const isLast = index === ingredients.length - 1;
          return (
            <div
              key={ingredient.name}
              ref={isLast ? lastIngredientRef : undefined}
            >
              <IngredientRow ingredient={ingredient} />
            </div>
          );
        })}

        {!isLoading &&
          !hasMore &&
          ingredients.length > 0 &&
          mode === "browse" && (
            <div className="py-4 text-center text-muted text-sm">
              {`${count} ingredients total`}
            </div>
          )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
        </div>
      )}

      {!isLoading && ingredients.length === 0 && !enableCreate && (
        <div className="py-8 text-center text-muted text-sm">
          No ingredients found
        </div>
      )}
    </div>
  );
};

export default IngredientList;
