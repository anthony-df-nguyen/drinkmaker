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
| `bg-background` | `#f5f4f1` warm-50 | `#0c0f0d` nocturne-bg | Page / layout bg |
| `bg-surface` | `#ffffff` white | `#141917` nocturne-surface | Cards, modals, dropdowns |
| `bg-surface-raised` | `#f0eeeb` warm-100 | `#1d2420` nocturne-raised | Inputs, hover rows |

### Borders
| Class | Light | Dark | Use for |
|---|---|---|---|
| `border-border` | `#e2ddd7` warm-200 | `#2a332e` nocturne-border | Default dividers |
| `border-border-strong` | `#ccc4bb` warm-300 | `#3a4a43` nocturne-border-strong | Emphasized borders |

### Text
| Class | Light | Dark | Use for |
|---|---|---|---|
| `text-foreground` | `#1a1714` warm-900 | `#e8edea` nocturne-fg | Primary text |
| `text-muted` | `#6b6460` warm-500 | `#8a9a8f` nocturne-muted | Labels, captions |
| `text-subtle` | `#a09a95` warm-400 | `#566059` nocturne-subtle | Placeholders, hints |

### Accent (emerald)
| Class | Light | Dark | Use for |
|---|---|---|---|
| `bg-accent` | `#059669` emerald-600 | `#34d399` emerald-400 | CTA button bg |
| `hover:bg-accent-hover` | `#047857` emerald-700 | `#6ee7b7` emerald-300 | CTA hover |
| `text-accent-foreground` | white | `#022c22` emerald-950 | Text on filled accent button |
| `bg-accent-subtle` | emerald-50 | emerald-950 | Tinted badge / tag bg |
| `text-accent-text` | `#065f46` emerald-800 | `#6ee7b7` emerald-300 | Colored text on bg |

### Drink category tags
| Class | Light | Dark | Use for |
|---|---|---|---|
| `bg-spirits-subtle text-spirits` | amber-100 / `#d97706` amber-500 | amber-950 / amber-300 | Spirits (rum, whiskey) |
| `bg-fruity-subtle text-fruity` | rose-50 / `#e11d48` rose-600 | rose-950 / rose-300 | Fruity cocktails |
| `bg-refreshing-subtle text-refreshing` | sky-50 / `#0284c7` sky-600 | sky-950 / sky-300 | Light / soda drinks |

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
- Quill styles in `_quill_styles.scss` — leave untouched
