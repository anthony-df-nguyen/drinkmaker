"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useListDrinks } from "./contexts/DrinksContext";
import Link from "next/link";
import Badge from "@/components/UI/Badge";
import { queryDrinks } from "./actions";
import { drinkTypeColors, DrinkSchema, drinkTypes } from "./models";
import TextInput from "@/components/UI/input";
import classNames from "@/utils/classNames";

const PAGE_SIZE = 30;

// Palette for the initial-letter thumbnail. Color is derived deterministically
// from the first character of the drink name so it's stable across renders.
const THUMBNAIL_COLORS = [
  "bg-gradient-to-br from-amber-400 to-amber-700",
  "bg-gradient-to-br from-blue-400 to-blue-700",
  "bg-gradient-to-br from-emerald-400 to-emerald-700",
  "bg-gradient-to-br from-rose-400 to-rose-600",
  "bg-gradient-to-br from-violet-400 to-violet-700",
  "bg-gradient-to-br from-cyan-400 to-cyan-700",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-teal-400 to-teal-700",
];

function thumbnailColor(name: string): string {
  return THUMBNAIL_COLORS[name.charCodeAt(0) % THUMBNAIL_COLORS.length];
}

// ─── DrinkThumbnail ──────────────────────────────────────────────────────────

interface DrinkThumbnailProps {
  name: string;
  picture?: string | null;
}

const DrinkThumbnail: React.FC<DrinkThumbnailProps> = ({ name, picture }) => {
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className="w-16 h-16 rounded object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div
      className={classNames(
        "w-16 h-16 rounded flex items-center justify-center flex-shrink-0",
        thumbnailColor(name),
      )}
    >
      <span className="text-white text-2xl font-semibold select-none">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

// ─── DrinkCard ───────────────────────────────────────────────────────────────

interface DrinkCardProps {
  drink: DrinkSchema;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const badgeColor = drinkTypeColors[drink.drink_type];

  return (
    <Link href={`/drinks/${drink.unique_name}`}>
      <div className="p-4 bg-background flex flex-row gap-4 items-center hover:bg-surface-raised transition-colors">
        <DrinkThumbnail name={drink.name} picture={drink.picture} />

        <div className="flex-1 min-w-0">
          <div className="font-serif text-base text-foreground truncate">
            {drink.name}
          </div>
          {/* <div className="">
            <Badge label={drink.drink_type} color={badgeColor} />
          </div> */}
          {drink.description && <div className="mt-1 text-xs font-light text-muted line-clamp-2 ">
            {drink.description}
          </div>}
        </div>
      </div>
    </Link>
  );
};

// ─── DrinkList ────────────────────────────────────────────────────────────────

// "All / Alcoholic / Non-alcoholic" pill options
const ALCOHOLIC_FILTERS: { label: string; value: "all" | "yes" | "no" }[] = [
  { label: "All", value: "all" },
  { label: "Alcoholic", value: "yes" },
  { label: "Non-alcoholic", value: "no" },
];

const DrinkList: React.FC = () => {
  const { drinksList, setDrinksList, setCount } = useListDrinks();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectDrinkType, setSelectDrinkType] = useState<string>("all");
  const [alcoholicFilter, setAlcoholicFilter] = useState<"all" | "yes" | "no">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  // Derive is_alcoholic value for the query
  const isAlcoholicParam =
    alcoholicFilter === "yes" ? true : alcoholicFilter === "no" ? false : undefined;

  // Reset pagination when search or filter changes
  useEffect(() => {
    setDrinksList([]);
    setCount(0);
    setHasMore(true);
    setPage(1);
  }, [searchTerm, selectDrinkType, alcoholicFilter, setDrinksList, setCount]);

  // Fetch first page when search or filter changes
  useEffect(() => {
    let cancelled = false;

    const fetchDrinks = async () => {
      try {
        setIsLoading(true);
        const data = await queryDrinks(
          1,
          PAGE_SIZE,
          searchTerm,
          selectDrinkType,
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
  }, [searchTerm, selectDrinkType, alcoholicFilter, isAlcoholicParam, setDrinksList, setCount]);

  const loadMoreDrinks = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const data = await queryDrinks(
        nextPage,
        PAGE_SIZE,
        searchTerm,
        selectDrinkType,
        false,
        isAlcoholicParam,
      );

      if (data.data.length === 0) {
        setHasMore(false);
        return;
      }

      setDrinksList((prev) => [...prev, ...data.data]);
      setHasMore(data.data.length === PAGE_SIZE);

      if (typeof data.totalCount === "number") {
        setCount(data.totalCount);
      }

      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more drinks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    hasMore,
    isLoading,
    isAlcoholicParam,
    page,
    searchTerm,
    selectDrinkType,
    setDrinksList,
    setCount,
  ]);

  // Attach IntersectionObserver to the last list item to trigger infinite scroll
  const lastDrinkRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) loadMoreDrinks();
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreDrinks],
  );

  return (
    <div>
      {/* Controls */}
      <div className="top-0 inset-x-0 z-30 bg-surface px-4 lg:px-0 py-4 box-border max-w-[860px] mx-auto border-b-[1px] border-border space-y-3">
        {/* Search */}
        <TextInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e)}
          placeholder="Search drinks..."
          delay={500}
        />

        {/* Type filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {drinkTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectDrinkType(type.value)}
              className={classNames(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                selectDrinkType === type.value
                  ? "bg-accent text-accent-foreground border-transparent"
                  : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Alcoholic filter chips */}
        <div className="flex gap-1.5">
          {ALCOHOLIC_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setAlcoholicFilter(f.value)}
              className={classNames(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                alcoholicFilter === f.value
                  ? "bg-surface-raised text-foreground border-border"
                  : "bg-transparent text-muted border-border hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
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
