# Drinkmaker Design Tokens

## What was set up
Two files were updated to create a semantic token system for light + dark mode:
- `app/styles/globals.scss` — CSS custom properties for `:root` (light) and `.dark` (dark)
- `tailwind.config.ts` — Tailwind color extensions that map to those CSS vars

Dark mode is class-based (`darkMode: "class"` in Tailwind), toggled by `next-themes` via `class="dark"` on `<html>`.

Tokens use space-separated RGB channels so Tailwind opacity modifiers work (e.g. `bg-surface/50`).

---

## Token cheat sheet

### Surfaces
| Class | Light | Dark | Use for |
|---|---|---|---|
| `bg-background` | slate-50 | slate-900 | Page / layout bg |
| `bg-surface` | white | slate-800 | Cards, modals, dropdowns |
| `bg-surface-raised` | slate-100 | slate-700 | Inputs, hover rows |

### Borders
| Class | Light | Dark | Use for |
|---|---|---|---|
| `border-border` | slate-200 | slate-700 | Default dividers |
| `border-border-strong` | slate-300 | slate-600 | Emphasized borders |

### Text
| Class | Light | Dark | Use for |
|---|---|---|---|
| `text-foreground` | slate-900 | slate-100 | Primary text |
| `text-muted` | slate-500 | slate-400 | Labels, captions |
| `text-subtle` | slate-400 | slate-500 | Placeholders, hints |

### Accent (emerald)
| Class | Light | Dark | Use for |
|---|---|---|---|
| `bg-accent` | emerald-600 | emerald-400 | CTA button bg |
| `hover:bg-accent-hover` | emerald-700 | emerald-300 | CTA hover |
| `text-accent-foreground` | white | emerald-950 | Text on filled accent button |
| `bg-accent-subtle` | emerald-50 | emerald-950 | Tinted badge / tag bg |
| `text-accent-text` | emerald-800 | emerald-300 | Colored text on bg |

### Drink category tags
| Class | Light | Dark | Use for |
|---|---|---|---|
| `bg-spirits-subtle text-spirits` | amber-100 / amber-700 | amber-950 / amber-300 | Spirits (rum, whiskey) |
| `bg-fruity-subtle text-fruity` | rose-50 / rose-800 | rose-950 / rose-300 | Fruity cocktails |
| `bg-refreshing-subtle text-refreshing` | sky-50 / sky-800 | sky-950 / sky-300 | Light / soda drinks |

---

## Migration patterns

Replace manual light+dark pairs with a single token:

```tsx
// Surfaces
bg-white dark:bg-slate-800          → bg-surface
bg-gray-100 dark:bg-stone-900       → bg-background
bg-slate-100 dark:bg-slate-700      → bg-surface-raised

// Borders
border-slate-200 dark:border-slate-700  → border-border

// Text
text-slate-900 dark:text-slate-100  → text-foreground
text-slate-500 dark:text-slate-400  → text-muted
text-slate-400 dark:text-slate-500  → text-subtle
text-gray-400 dark:text-gray-400    → text-muted

// Accent buttons
bg-emerald-600 hover:bg-emerald-700 text-white  → bg-accent hover:bg-accent-hover text-accent-foreground

// Accent text / links
text-emerald-600 dark:text-emerald-400  → text-accent-text

// Green badges
bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300  → bg-accent-subtle text-accent-text
```

### layout.tsx body (needs updating)
```tsx
// Current
<body className="h-full bg-gray-100 dark:bg-stone-900 dark:text-gray-400">

// Updated
<body className="h-full bg-background text-foreground">
```

---

## Existing class to leave alone
- `pageTitle` in globals.scss uses `text-emerald-600 dark:text-white` — can migrate to `text-accent-text dark:text-foreground` or keep as-is
- MUI / Quill styles in `_mui_styles.scss` and `_quill_styles.scss` — leave untouched
