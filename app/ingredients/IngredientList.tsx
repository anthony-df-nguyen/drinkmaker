"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useListIngredients } from "./context/ListIngredientsContext";
import { formatText } from "@/utils/formatText";
import { PlusIcon } from "@heroicons/react/20/solid";
import { queryIngredients, createIngredient, searchForIngredient } from "./actions";
import { sanitizeInput, validateInput } from "@/utils/sanitizeInput";
import checkExisting from "@/utils/supabase/checkExisting";
import { enqueueSnackbar } from "notistack";
import TextInput from "@/components/UI/input";
import { cn } from "@/lib/utils";
import { IngredientsSchema } from "./models";

const PAGE_SIZE = 10;

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

// ─── IngredientRow ────────────────────────────────────────────────────────────

interface IngredientRowProps {
  ingredient: IngredientsSchema;
}

const IngredientRow: React.FC<IngredientRowProps> = ({ ingredient }) => {
  const name = formatText(ingredient.name);
  return (
    <div className="p-4 bg-background flex flex-row gap-4 items-center hover:bg-surface-raised transition-colors">
      <div
        className={cn(
          "w-10 h-10 rounded flex items-center justify-center flex-shrink-0",
          thumbnailColor(ingredient.name),
        )}
      >
        <span className="text-white text-base font-semibold select-none">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground truncate">{name}</div>
      </div>
    </div>
  );
};

// ─── CreateRow ────────────────────────────────────────────────────────────────

interface CreateRowProps {
  name: string;
  onClick: () => void;
}

const CreateRow: React.FC<CreateRowProps> = ({ name, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full p-4 flex flex-row gap-4 items-center bg-accent-subtle hover:bg-accent-subtle/80 transition-colors text-left"
  >
    <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 bg-accent/20">
      <PlusIcon className="w-5 h-5 text-accent-text" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-accent-text truncate">
        Create &ldquo;{formatText(name)}&rdquo;
      </div>
    </div>
  </button>
);

// ─── IngredientList ───────────────────────────────────────────────────────────

const IngredientList: React.FC = () => {
  const { ingredients, setIngredients, count, mode, setMode, refreshBrowseFirstPage } =
    useListIngredients();

  const [searchTerm, setSearchTerm] = useState("");
  const [cleanTerm, setCleanTerm] = useState("");
  const [enableCreate, setEnableCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const searchRequestRef = useRef(0);

  // ── Infinite scroll ────────────────────────────────────────────────────────

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || mode !== "browse") return;
    const nextPage = page + 1;
    setIsLoading(true);
    try {
      const data = await queryIngredients(nextPage, PAGE_SIZE);
      if (data.length === 0) { setHasMore(false); return; }
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

  // Attach observer to the last rendered ingredient row
  const lastIngredientRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      observer.current?.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMore],
  );

  // Reset pagination only when mode changes, not on every ingredient append
  useEffect(() => {
    if (mode === "browse") {
      setPage(1);
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [mode]);

  // ── Search ─────────────────────────────────────────────────────────────────

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

  // ── Create ─────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!enableCreate || isCreating) return;
    setIsCreating(true);
    try {
      await createIngredient({ name: cleanTerm });
      enqueueSnackbar(`"${formatText(cleanTerm)}" added`, { variant: "success" });
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Search bar */}
      <div className="top-0 inset-x-0 z-30 bg-surface px-4 lg:px-0 py-4 border-b border-border">
        <TextInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search or add an ingredient..."
          delay={600}
        />
      </div>

      {/* Results */}
      <div className="grid gap-0 divide-y divide-border max-h-[80vh] overflow-auto">
        {enableCreate && cleanTerm.length >= 3 && (
          <CreateRow name={cleanTerm} onClick={handleCreate} />
        )}

        {ingredients.map((ingredient, index) => {
          const isLast = index === ingredients.length - 1;
          return (
            <div key={ingredient.name} ref={isLast ? lastIngredientRef : undefined}>
              <IngredientRow ingredient={ingredient} />
            </div>
          );
        })}

        {!isLoading && !hasMore && ingredients.length > 0 && mode === "browse" && (
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
        <div className="py-8 text-center text-muted text-sm">No ingredients found</div>
      )}
    </div>
  );
};

export default IngredientList;
