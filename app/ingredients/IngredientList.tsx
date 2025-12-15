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
  const { ingredients, setIngredients, count, mode } = useListIngredients();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const modeRef = useRef(mode);

  const PAGE_SIZE = 10;
  const requestVersionRef = useRef(0);

  const fetchIngredientsPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      const reqVersion = ++requestVersionRef.current;
      try {
        const data = await queryIngredients(nextPage, PAGE_SIZE);

        // If mode changed (e.g., search/clear) while this request was in-flight, ignore results.
        if (requestVersionRef.current !== reqVersion) return;
        if (modeRef.current !== "browse" && mode === "append") return;

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
    modeRef.current = mode;
  }, [page, isLoading, hasMore, mode]);

  const maybeLoadMore = useCallback(() => {
    const rootEl = scrollContainerRef.current;
    const sentinelEl = sentinelRef.current;
    if (!rootEl || !sentinelEl) return;

    if (modeRef.current !== "browse") return;
    if (isLoadingRef.current) return;
    if (!hasMoreRef.current) return;

    const rootRect = rootEl.getBoundingClientRect();
    const sentinelRect = sentinelEl.getBoundingClientRect();

    // If sentinel is within (or near) the viewport of the scroll container, load more.
    if (sentinelRect.top <= rootRect.bottom + 200) {
      const nextPage = pageRef.current + 1;
      pageRef.current = nextPage;
      setPage(nextPage);
      fetchIngredientsPage(nextPage, "append");
    }
  }, [fetchIngredientsPage]);

  useEffect(() => {
    modeRef.current = mode;

    if (mode === "search") {
      // Disable infinite scroll while showing search results
      setHasMore(false);
      return;
    }

    // Browse mode: hasMore is driven by total count
    setHasMore(ingredients.length < count);

    // If we just returned to browse (e.g., cleared search), reset paging to match page-1 data
    pageRef.current = 1;
    setPage(1);
  }, [mode, count, ingredients.length]);

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
        maybeLoadMore();
      },
      {
        root: rootEl,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinelEl);

    // Important: on mode changes (e.g., clear search), the sentinel may already be visible.
    // This makes sure we load more without waiting for a new intersection event.
    maybeLoadMore();

    return () => {
      observerRef.current?.disconnect();
    };
  }, [maybeLoadMore]);

  // After items append (or loading completes), if we're still near the bottom,
  // trigger the next page without requiring the sentinel to exit/re-enter.
  useEffect(() => {
    if (mode !== "browse") return;
    if (isLoading) return;
    if (!hasMore) return;

    // Defer to the next frame so layout/scrollHeight is updated
    const id = requestAnimationFrame(() => {
      maybeLoadMore();
    });

    return () => cancelAnimationFrame(id);
  }, [ingredients.length, isLoading, hasMore, mode, maybeLoadMore]);

  return (
    <div className="mt-4">
      <div
        ref={scrollContainerRef}
        className="mt-8 grid gap-2 w-full max-h-[65vh] overflow-scroll "
      >
        {ingredients.map((ingredient) => (
          <Card key={ingredient.name}>
            <div className="flex items-center gap-2 justify-between ">
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
