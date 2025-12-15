"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import Link from "next/link";
import Card from "@/components/UI/Card";
import Badge from "@/components/UI/Badge";
import { queryDrinks } from "./actions";
import { drinkTypeColors, drinkTypes } from "./models";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";

const DrinkList: React.FC = () => {
  const { drinksList, setDrinksList, count, setCount } = useListDrinks();
  const [searchTerm, handleSearchTermChange] = useState<string>("");
  const [selectDrinkType, setSelectDrinkType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const PAGE_SIZE = 10;

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver | null>(null);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setDrinksList([]);
    setCount(0);
    setHasMore(true);
    setPage(1);
  }, [searchTerm, selectDrinkType, setDrinksList, setCount]);

  // Fetch drinks when search or filter changes
  useEffect(() => {
    let cancelled = false;

    const fetchDrinks = async () => {
      try {
        setIsLoading(true);
        const data = await queryDrinks(1, PAGE_SIZE, searchTerm, selectDrinkType);
        if (cancelled) return;

        setDrinksList(data.data);
        if (typeof data.totalCount === "number") {
          setCount(data.totalCount);
          setHasMore(data.data.length < data.totalCount);
        } else {
          // Fallback when count isn't available
          setHasMore(data.data.length === PAGE_SIZE);
        }
        setPage(1);
      } catch (error) {
        console.error("Error querying drinks: ", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDrinks();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, selectDrinkType, setDrinksList, setCount]);

  const loadMoreDrinks = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const data = await queryDrinks(nextPage, PAGE_SIZE, searchTerm, selectDrinkType, false);

      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      // Merge and then update hasMore separately (avoid setState inside another setState updater)
      setDrinksList((prev) => [...prev, ...data.data]);

      // When we don't request count, a short page means we're done
      setHasMore(data.data.length === PAGE_SIZE);

      // Only update count if we actually have one
      if (typeof data.totalCount === "number") {
        setCount(data.totalCount);
      }

      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more drinks: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [PAGE_SIZE, hasMore, isLoading, page, searchTerm, selectDrinkType, setDrinksList, setCount]);

  const lastDrinkElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreDrinks();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreDrinks]
  );

  return (
    <div className="mt-4 grid gap-2">
      {/* Controls */}
      <div className="flex flex-row gap-4 mb-4">
        <div className="w-[240px] md:w-[300px]">
          <DebouncedTextInput
            label="Search for Drink"
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e)}
            placeholder="Drink Name"
            delay={500}
            variant="filled"
            size="small"
          />
        </div>
        <div className="flex-1 sm:flex-none sm:w-[200px] max-w-[200px]">
          <CustomSelect
            label="Drink Type"
            options={drinkTypes}
            value={selectDrinkType}
            onChange={(e) => setSelectDrinkType(e)}
            variant="filled"
            size="small"
          />
        </div>
      </div>

      {/* Grid/Results */}
      <div className="grid gap-4 xl:grid-cols-1 ">
        {drinksList.map((drink, index) => {
          const color = drinkTypeColors[drink.drink_type];

          // Set ref on the last element to trigger infinite scroll
          if (index === drinksList.length - 1) {
            return (
              <div key={drink.unique_name} ref={lastDrinkElementRef}>
                <Link href={`/drinks/${drink.unique_name}`}>
                  <Card className="w-full h-full">
                    <div className="flex flex-col gap-1 justify-start h-full">
                      <div className="flex item-center gap-2 justify-between">
                        <div className="text-base text-gray-900 dark:text-white">
                          {drink.name}
                        </div>
                        <div className="text-xs h-1">
                          <Badge label={drink.drink_type} color={color} />
                        </div>
                      </div>

                      <div className="text-xs font-light text-gray-700 dark:text-gray-300 flex-1">
                        {drink.description}
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            );
          }

          return (
            <Link key={drink.unique_name} href={`/drinks/${drink.unique_name}`}>
              <Card className="w-full h-full">
                <div className="flex flex-col gap-1 justify-start h-full">
                  <div className="flex item-center gap-2 justify-between">
                    <div className="text-base text-gray-900 dark:text-white">
                      {drink.name}
                    </div>
                    <div className="text-xs h-1">
                      <Badge label={drink.drink_type} color={color} />
                    </div>
                  </div>

                  <div className="text-xs font-light text-gray-700 dark:text-gray-300 flex-1">
                    {drink.description}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && drinksList.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          This is the end
        </div>
      )}
    </div>
  );
};

export default DrinkList;
