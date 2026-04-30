# Implementation Brief: Smart Scale + Unit Conversion

## Goal
Upgrade the ingredient scaling UI on the drink detail page to support Smart Scale — automatic unit promotion as quantities grow — with per-ingredient manual overrides.

---

## Files to touch

| File | Change |
|---|---|
| `app/drinks/[slug]/drink_ingredients/DrinkIngredients.tsx` | Primary UI changes |
| `app/drinks/[slug]/drink_ingredients/utils.ts` | Add conversion + smart scale logic |
| `app/drinks/[slug]/drink_ingredients/models.ts` | Extend `DrinkIngredientViewData` |

Do not touch `constants.ts`, `actions.ts`, or any styles files.

---

## Conversion rules

Volume chain (these units are interconvertible):

```
tsp → tbsp → oz → ml
3 tsp = 1 tbsp
2 tbsp = 1 oz  (i.e. 6 tsp = 1 oz)
1 oz = 29.574 ml
```

All other units in `measuringUnits` (dash, slice, wedge, piece, pinch, drop, splash, shot, glass, cup, part) are **non-convertible** — never modify them.

Smart Scale promotion thresholds (applied to the scaled total in tsp-equivalent):

```
< 3 tsp equivalent  → display in tsp
≥ 3 tsp             → display in tbsp
≥ 6 tsp (1 oz)      → display in oz
≥ 192 tsp (32 oz)   → display in ml
```

---

## utils.ts additions

Add these pure functions. Do not remove `getStepForUnit`.

```ts
// Units that participate in the volume conversion chain
export const VOLUME_UNITS = ["tsp", "tbsp", "oz", "ml"] as const;
export type VolumeUnit = typeof VOLUME_UNITS[number];

// Convert any volume unit quantity to tsp
export function toTsp(qty: number, unit: VolumeUnit): number {
  switch (unit) {
    case "tsp":  return qty;
    case "tbsp": return qty * 3;
    case "oz":   return qty * 6;
    case "ml":   return qty / 29.574 * 6;
  }
}

// Convert a tsp quantity to a target unit
export function fromTsp(tsp: number, unit: VolumeUnit): number {
  switch (unit) {
    case "tsp":  return tsp;
    case "tbsp": return tsp / 3;
    case "oz":   return tsp / 6;
    case "ml":   return tsp / 6 * 29.574;
  }
}

// Given a scaled tsp total, return the best display unit
export function smartUnit(tspTotal: number): VolumeUnit {
  if (tspTotal >= 192) return "ml";
  if (tspTotal >= 6)   return "oz";
  if (tspTotal >= 3)   return "tbsp";
  return "tsp";
}

// Format a quantity as a readable fraction or decimal
export function formatQty(val: number): string {
  const fracs: [number, string][] = [
    [0.125, "⅛"], [0.25, "¼"], [0.33, "⅓"],
    [0.5, "½"], [0.67, "⅔"], [0.75, "¾"],
  ];
  const whole = Math.floor(val);
  const rem = val - whole;
  for (const [dec, sym] of fracs) {
    if (Math.abs(rem - dec) < 0.04) {
      return (whole ? `${whole} ` : "") + sym;
    }
  }
  return parseFloat(val.toFixed(2)).toString();
}
```

---

## models.ts additions

Extend `DrinkIngredientViewData` to track the base unit separately from the display unit:

```ts
export interface DrinkIngredientViewData {
  name: string;
  quantity: number;      // base quantity (as stored)
  unit: string;          // base unit (as stored)
  role: string;
  displayQty: string;    // formatted scaled quantity string
  displayUnit: string;   // unit after smart scale / override
  isVolumeUnit: boolean; // whether this ingredient can be converted
  isOverridden: boolean; // whether user has manually set the unit
}
```

---

## DrinkIngredients.tsx — full rewrite of ReadView

### State

```ts
const [multiplier, setMultiplier] = useState<number>(1);
const [smartScale, setSmartScale] = useState<boolean>(true);
const [overrides, setOverrides] = useState<Record<number, VolumeUnit>>({});
```

Reset `overrides` to `{}` whenever `multiplier` changes.

### Computing display data

For each ingredient:
1. Check if `ing.unit` is in `VOLUME_UNITS`
2. If yes:
   - Compute `tspTotal = toTsp(ing.quantity * multiplier, ing.unit as VolumeUnit)`
   - If override exists for this index, use it as `displayUnit`
   - Else if `smartScale` is on, use `smartUnit(tspTotal)` as `displayUnit`
   - Else use `ing.unit` as `displayUnit`
   - `displayQty = formatQty(fromTsp(tspTotal, displayUnit))`
3. If not a volume unit:
   - `displayQty = formatQty(ing.quantity * multiplier)`
   - `displayUnit = ing.unit`

### Unit override handler

```ts
const setUnitOverride = (index: number, unit: VolumeUnit) => {
  // If user picks the same unit smart scale would have chosen, clear the override
  const ing = ingredients[index];
  const tspTotal = toTsp(ing.quantity * multiplier, ing.unit as VolumeUnit);
  const autoUnit = smartScale ? smartUnit(tspTotal) : ing.unit;
  if (unit === autoUnit) {
    setOverrides(prev => { const next = { ...prev }; delete next[index]; return next; });
  } else {
    setOverrides(prev => ({ ...prev, [index]: unit }));
  }
};
```

### UI changes

**Servings control** — keep the existing `+` / `−` button group. No changes needed except wiring the multiplier change to also clear overrides.

**Smart Scale toggle** — add to the right of the servings control, before or after it in the flex row:
- Label: "Smart scale"
- Use a standard HTML checkbox or a small toggle built from Tailwind — do not use MUI here, this is a read view
- When toggled off, clear all overrides
- Style the "on" state with `bg-accent` (green)

**Unit column** — replace the plain text unit cell with an interactive chip for volume units:
- Chip shows `displayUnit`
- Click opens a small inline dropdown listing the 4 volume units (`tsp`, `tbsp`, `oz`, `ml`)
- Active unit is visually marked (font-weight 500, `text-accent-text`)
- If the ingredient has a manual override (`isOverridden: true`), style the chip with `bg-spirits-subtle text-spirits` (amber) to signal it's been manually set
- Non-volume unit cells render as plain text — no chip, no interaction

**Quantity column** — display `displayQty` (the formatted string) instead of the raw number.

---

## Constraints

- Scaling and conversion happen **at display time only** — never mutate `globalDrinkForm`
- The `CardTable` component may need to be bypassed for the Unit column since it needs interactive elements — render the table manually if `CardTable` only accepts string/number accessors
- Use `cx()` from `@/utils/classNames` for all conditional class merging
- No new npm packages
