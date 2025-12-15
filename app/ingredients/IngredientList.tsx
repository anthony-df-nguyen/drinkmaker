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

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const modeRef = useRef(mode);
  const lastUserScrollTsRef = useRef(0);

  const PAGE_SIZE = 10;
  const requestVersionRef = useRef(0);

  const maybeLoadMoreRef = useRef<() => void>(() => {});

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

        const nextHasMore =
          typeof count === "number" ? (mode === "replace" ? data.length < count : true) : data.length === PAGE_SIZE;
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
      } catch (error) {
        console.error("Error querying ingredients: ", error);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);

        // If the user is actively scrolling and still near the bottom after this page appended,
        // trigger one more load so they don't have to scroll up/down to re-fire the observer.
        const scrolledRecently = Date.now() - lastUserScrollTsRef.current < 1200;
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 300;

        if (
          scrolledRecently &&
          modeRef.current === "browse" &&
          hasMoreRef.current &&
          !isLoadingRef.current &&
          nearBottom
        ) {
          // Defer to let layout/scrollHeight settle
          requestAnimationFrame(() => {
            maybeLoadMoreRef.current();
          });
        }
      }
    },
    [count, setIngredients]
  );

  const maybeLoadMore = useCallback(() => {
    if (modeRef.current !== "browse") return;
    if (isLoadingRef.current) return;
    if (!hasMoreRef.current) return;

    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    setPage(nextPage);
    fetchIngredientsPage(nextPage, "append");
  }, [fetchIngredientsPage]);

  useEffect(() => {
    maybeLoadMoreRef.current = maybeLoadMore;
  }, [maybeLoadMore]);

  useEffect(() => {
    pageRef.current = page;
    isLoadingRef.current = isLoading;
    hasMoreRef.current = hasMore;
    modeRef.current = mode;
  }, [page, isLoading, hasMore, mode]);

  useEffect(() => {
    const onScroll = () => {
      lastUserScrollTsRef.current = Date.now();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    modeRef.current = mode;

    if (mode === "search") {
      // Disable infinite scroll while showing search results
      setHasMore(false);
      return;
    }

    // Returned to browse mode (e.g., cleared search)
    pageRef.current = 1;
    setPage(1);

    // Re-enable infinite scroll
    setHasMore(true);
    hasMoreRef.current = true;

    // Observer will resume loading pages as sentinel intersects
  }, [mode, count, ingredients.length]);

  // Set up infinite scroll observer (uses the browser viewport as the root)
  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        maybeLoadMore();
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinelEl);
  }, [maybeLoadMore, ingredients.length]);

  return (
    <div style={{
      marginTop: mode === "browse" ? "5.2em" : "8.5em",
    }}>
      <div className="mt-8 grid gap-2 w-full ">
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
