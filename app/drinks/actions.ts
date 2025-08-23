"use server";

import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import { DrinkSchema, CreateDrinkFields, MutableDrinkFields } from "./models";
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
  drinkType?: string
): Promise<{
  data: (DrinkSchema & { username: string | null })[];
  totalCount: number;
}> => {
  const pg = await createSupabaseServerActionClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // If you have multiple FKs to profiles, disambiguate like:
  // profiles!drinks_created_by_user_id_fkey ( username )
  let query = pg
    .from("drinks")
    .select(
      `
      *,
      profiles ( username )
    `,
      { count: "exact" } // <-- ensures `count` is populated
    )
    .order("name", { ascending: true })
    .range(from, to);

  if (searchName) query = query.ilike("name", `%${searchName}%`);
  if (drinkType && drinkType !== "all") query = query.eq("drink_type", drinkType);

  const { data, error, count } = await query;
  if (error) throw new Error(`Error querying drinks: ${error.message}`);

  const withUser = (data ?? []).map((d: any) => ({
    ...(d as DrinkSchema),
    username: d.profiles?.username ?? null,
  }));

  return { data: withUser, totalCount: count ?? 0 };
};

const getDrinkByID = async (slug: string): Promise<DrinkSchema & { username: string | null }> => {
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg
    .from("drinks")
    .select(
      `
      *,
      profiles ( username )
    `
    )
    .eq("unique_name", slug)
    .single();

  if (error) throw new Error(`Error querying for unique_name: ${error.message}`);

  const drink = data as any;
  return { ...(drink as DrinkSchema), username: drink?.profiles?.username ?? null };
};

export { createDrink, deleteDrink, updateDrinkBasics, queryDrinks, getDrinkByID };
