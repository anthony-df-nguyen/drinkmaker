import React, { useEffect, useRef, useState, useCallback } from "react";
import { useListIngredients } from "./context/ListIngredientsContext";
import { formatText } from "@/utils/formatText";
import Card from "@/components/UI/Card";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import EditForm from "./forms/EditForm";
import DeleteForm from "./forms/DeleteForm";
import { queryIngredients } from "./actions";
import { useModal } from "@/context/ModalContext";

/**
 * Renders a list of ingredients.
 *
 * @component
 * @returns {JSX.Element} The rendered IngredientList component.
 */
const IngredientList: React.FC = () => {
  const { showModal } = useModal();
  const { ingredients, setIngredients, count } = useListIngredients();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const PAGE_SIZE = 10;

  const fetchIngredientsPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        const data = await queryIngredients(nextPage, PAGE_SIZE);

        setIngredients((prev) => {
          if (mode === "replace") return data;
          // dedupe by name just in case
          const existing = new Set(prev.map((i) => i.name));
          const merged = [...prev, ...data.filter((i) => !existing.has(i.name))];
          return merged;
        });

        // If you have a total `count` from context, use it to determine hasMore.
        // Otherwise fall back to whether we got a full page.
        // const optimisticHasMore = data.length === PAGE_SIZE;
        // setHasMore(count != null ? (mode === "replace" ? data.length < count : true) : optimisticHasMore);
      } catch (error) {
        console.error("Error querying ingredients: ", error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [count, setIngredients]
  );

  useEffect(() => {
    pageRef.current = page;
    isLoadingRef.current = isLoading;
    hasMoreRef.current = hasMore;
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    setHasMore(ingredients.length < count);
  }, [count, ingredients.length]);

  // Set up infinite scroll observer (uses the scrollable div as the root)
  useEffect(() => {
    const rootEl = scrollContainerRef.current;
    const sentinelEl = sentinelRef.current;
    if (!rootEl || !sentinelEl) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (isLoadingRef.current) return;
        if (!hasMoreRef.current) return;

        const nextPage = pageRef.current + 1;
        // update both ref + state so UI stays in sync
        pageRef.current = nextPage;
        setPage(nextPage);
        fetchIngredientsPage(nextPage, "append");
      },
      {
        root: rootEl,
        rootMargin: "200px", // start loading a bit before reaching the bottom
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinelEl);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchIngredientsPage]);

  return (
    <div className="mt-4">
      <div
        ref={scrollContainerRef}
        className="mt-8 grid gap-2 max-h-[65vh] overflow-y-scroll no-scrollbar"
      >
        {ingredients.map((ingredient) => (
          <Card key={ingredient.name}>
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="text-base">{formatText(ingredient.name)}</div>
              <div className="flex-1"></div>
              <div
                className="text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() => showModal(<EditForm ingredient={ingredient} />)}
              >
                <PencilSquareIcon />
              </div>
              <div
                className="text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() =>
                  showModal(<DeleteForm ingredient={ingredient} />)
                }
              >
                <TrashIcon />
              </div>
            </div>
          </Card>
        ))}

        <div ref={sentinelRef} className="h-1" />

        {isLoading && (
          <div className="py-3 text-center text-sm text-gray-500">
            Loading…
          </div>
        )}

        {!isLoading && !hasMore && ingredients.length > 0 && (
          <div className="py-3 text-center text-sm text-gray-400">
            You’ve reached the end.
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientList;
