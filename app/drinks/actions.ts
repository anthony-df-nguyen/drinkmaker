"use server";

import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import { calculateRange } from "@/utils/supabase/pagination";
import {
  DrinkSchema,
  DrinkWithUsername,
  CreateDrinkFields,
  MutableDrinkFields,
} from "./models";
import { sanitizeInput } from "@/utils/sanitizeInput";
import getUserSessionOnServer from "@/utils/supabase/getUserSessionServer";

// ── helpers (not exported) ────────────────────────────────────────────────────

const getExistingDrinksWithName = async (name: string) => {
  const pg = await createSupabaseServerActionClient();
  const sanitizedName = sanitizeInput(name);
  const { data, error } = await pg
    .from("drinks")
    .select("unique_name")
    .ilike("unique_name", `${sanitizedName}%`);

  if (error) throw new Error("Error fetching drinks with the same name");
  return data as { unique_name: string }[];
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getNextFriendlyNumber = (
  existingDrinks: { unique_name: string }[],
  name: string
): number => {
  const base = sanitizeInput(name);
  const esc = escapeRegExp(base);
  const rx = new RegExp(`^${esc}(?:_(\\d+))?$`);

  const nums = existingDrinks
    .map((d) => {
      const m = d.unique_name.match(rx);
      if (!m) return 0;
      return m[1] ? parseInt(m[1], 10) : 1;
    })
    .filter((n) => !Number.isNaN(n) && n > 0)
    .sort((a, b) => a - b);

  // find first gap in 1..n
  for (let i = 1; i <= nums.length; i++) {
    if (nums[i - 1] !== i) return i;
  }
  return nums.length + 1;
};

// ── actions (exported) ───────────────────────────────────────────────────────

const createDrink = async (formData: CreateDrinkFields) => {
  const user = await getUserSessionOnServer();
  if (!user) throw new Error("User not authenticated");

  const pg = await createSupabaseServerActionClient();

  const existing = await getExistingDrinksWithName(formData.name);
  const friendlyNumber = getNextFriendlyNumber(existing, formData.name);
  const base = sanitizeInput(formData.name);
  const unique_name = friendlyNumber === 1 ? base : `${base}_${friendlyNumber}`;

  const postDrink = {
    ...formData,
    created_by: user.id, //
    unique_name,
  };

  const { data, error } = await pg.from("drinks").insert(postDrink).select().single();
  if (error) throw new Error(error.message || "Drink could not be created");
  return data as DrinkSchema;
};

const deleteDrink = async (id: string) => {
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg.from("drinks").delete().eq("id", id).select().single();
  if (error) throw new Error(error.message || "Error deleting drink");
  return data as DrinkSchema;
};

const updateDrinkBasics = async (id: string, fields: MutableDrinkFields) => {
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg.from("drinks").update(fields).eq("id", id).select().single();
  if (error) throw new Error(error.message || "Error updating drink");
  return data as DrinkSchema;
};

const queryDrinks = async (
  page: number,
  limit: number,
  searchName?: string,
  drinkType?: string,
  includeCount: boolean = true,
  isAlcoholic?: boolean | null
): Promise<{
  data: DrinkWithUsername[];
  totalCount: number | null;
}> => {
  const pg = await createSupabaseServerActionClient();
  const { from, to } = calculateRange(page, limit);

  const trimmedSearch = searchName?.trim();

  let query = pg
    .from("drinks")
    .select(
      `
      *,
      profiles!created_by ( username )
    `,
      includeCount ? { count: "exact" } : undefined
    )
    // Deterministic ordering so pagination is stable
    .order("name", { ascending: true })
    .order("id", { ascending: true });

  // Apply filters
  if (trimmedSearch) {
    query = query.ilike("name", `%${trimmedSearch}%`);
  }
  if (drinkType && drinkType !== "all") {
    query = query.eq("drink_type", drinkType);
  }
  if (isAlcoholic === true) {
    query = query.eq("is_alcoholic", true);
  } else if (isAlcoholic === false) {
    query = query.eq("is_alcoholic", false);
  }

  // Apply range (after filters)
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.error("Supabase query error:", error);
    throw new Error(`Error querying drinks: ${error.message}`);
  }

  const withUser: DrinkWithUsername[] = (data ?? []).map((d) => {
    const drink = d as DrinkSchema;
    return { ...drink, username: drink.profiles?.username ?? null };
  });

  return { data: withUser, totalCount: includeCount ? (count ?? 0) : null };
};

const getDrinkByID = async (slug: string): Promise<DrinkWithUsername> => {
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg
    .from("drinks")
    .select(
      `
      *,
      profiles!created_by ( username )
    `
    )
    .eq("unique_name", slug)
    .single();

  if (error) throw new Error(`Error querying for unique_name: ${error.message}`);

  const drink = data as DrinkSchema;
  return { ...drink, username: drink.profiles?.username ?? null };
};

const getDrinkCountByUser = async (userId: string): Promise<number> => {
  const pg = await createSupabaseServerActionClient();
  const { count, error } = await pg
    .from("drinks")
    .select("*", { count: "exact", head: true })
    .eq("created_by", userId);

  if (error) throw new Error(`Error counting drinks for user: ${error.message}`);
  return count ?? 0;
};

const toggleFavorite = async (drinkId: string): Promise<{ favorited: boolean }> => {
  const user = await getUserSessionOnServer();
  if (!user) throw new Error("User not authenticated");

  const pg = await createSupabaseServerActionClient();

  const { data: existing } = await pg
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("drink_id", drinkId)
    .maybeSingle();

  if (existing) {
    const { error } = await pg.from("favorites").delete().eq("id", existing.id);
    if (error) throw new Error(error.message || "Error removing favorite");
    return { favorited: false };
  } else {
    const { error } = await pg.from("favorites").insert({ user_id: user.id, drink_id: drinkId });
    if (error) throw new Error(error.message || "Error adding favorite");
    return { favorited: true };
  }
};

const getUserFavoriteDrinkIds = async (): Promise<string[]> => {
  const user = await getUserSessionOnServer();
  if (!user) return [];

  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg
    .from("favorites")
    .select("drink_id")
    .eq("user_id", user.id);

  if (error) throw new Error(error.message || "Error fetching favorites");
  return (data ?? []).map((row) => row.drink_id as string);
};

export { createDrink, deleteDrink, updateDrinkBasics, queryDrinks, getDrinkByID, getDrinkCountByUser, toggleFavorite, getUserFavoriteDrinkIds };