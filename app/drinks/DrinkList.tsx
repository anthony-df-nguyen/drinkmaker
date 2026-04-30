"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import { queryDrinks } from "./actions";
import DrinkCard from "./components/DrinkCard";
import DrinkFilters, { AlcoholicFilter } from "./components/DrinkFilters";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const PAGE_SIZE = 30;

const DrinkList: React.FC = () => {
  const { drinksList, setDrinksList, setCount } = useListDrinks();
  const [searchTerm, setSearchTerm] = useState("");
  const [drinkType, setDrinkType] = useState("all");
  const [alcoholicFilter, setAlcoholicFilter] = useState<AlcoholicFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const isAlcoholicParam =
    alcoholicFilter === "yes" ? true : alcoholicFilter === "no" ? false : undefined;

  // Reset pagination when filters change
  useEffect(() => {
    setDrinksList([]);
    setCount(0);
    setHasMore(true);
    setPage(1);
  }, [searchTerm, drinkType, alcoholicFilter, setDrinksList, setCount]);

  // Fetch first page when filters change
  useEffect(() => {
    let cancelled = false;

    const fetchDrinks = async () => {
      try {
        setIsLoading(true);
        const data = await queryDrinks(
          1,
          PAGE_SIZE,
          searchTerm,
          drinkType,
          true,
          isAlcoholicParam,
        );
        if (cancelled) return;

        setDrinksList(data.data);
        if (typeof data.totalCount === "number") {
          setCount(data.totalCount);
          setHasMore(data.data.length < data.totalCount);
        } else {
          setHasMore(data.data.length === PAGE_SIZE);
        }
        setPage(1);
      } catch (error) {
        console.error("Error querying drinks:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDrinks();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, drinkType, alcoholicFilter, isAlcoholicParam, setDrinksList, setCount]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const data = await queryDrinks(
        nextPage,
        PAGE_SIZE,
        searchTerm,
        drinkType,
        false,
        isAlcoholicParam,
      );

      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      setDrinksList((prev) => [...prev, ...data.data]);
      setHasMore(data.data.length === PAGE_SIZE);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more drinks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, isAlcoholicParam, page, searchTerm, drinkType, setDrinksList]);

  const lastDrinkRef = useIntersectionObserver(loadMore, isLoading);

  return (
    <div>
      <DrinkFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        drinkType={drinkType}
        onDrinkTypeChange={setDrinkType}
        alcoholicFilter={alcoholicFilter}
        onAlcoholicFilterChange={setAlcoholicFilter}
      />

      <div className="grid gap-0 divide-y-[1px] divide-border xl:grid-cols-1 max-h-[80vh] overflow-auto">
        {drinksList.map((drink, index) => {
          const isLast = index === drinksList.length - 1;
          return (
            <div
              key={drink.unique_name}
              ref={isLast ? lastDrinkRef : undefined}
            >
              <DrinkCard drink={drink} />
            </div>
          );
        })}

        {!hasMore && drinksList.length > 0 && (
          <div className="text-center py-4 text-muted text-base">
            {`${drinksList.length} drinks total`}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      )}

      {!isLoading && drinksList.length === 0 && (
        <div className="flex justify-center">
          <div className="text-center text-muted">No drinks found</div>
        </div>
      )}
    </div>
  );
};

export default DrinkList;
