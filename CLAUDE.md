# Drinkmaker — Claude context

Cocktail recipe app. Users can create, edit, and browse drink recipes with ingredients and rich-text instructions.

## Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + SCSS (`app/styles/globals.scss`)
- **UI components**: MUI (Material UI) for form inputs; custom components in `components/UI/`
- **Rich text**: Quill editor (`react-quill`)
- **Auth + DB**: Supabase (`@supabase/ssr`)
- **Dark mode**: `next-themes` — toggles `class="dark"` on `<html>`, Tailwind `darkMode: "class"`
- **Notifications**: notistack (`enqueueSnackbar`)
- **Font**: Inter (loaded via `next/font/google` + `https://rsms.me/inter/inter.css`)

## Folder structure

```
app/                    # Next.js App Router pages + co-located components
  drinks/               # Drink list, create form, drink detail
    [slug]/             # Drink detail — ingredients, instructions, edit
  ingredients/          # Ingredient list + forms
  profile/              # User profile
  styles/
    globals.scss        # Tailwind directives + design tokens (CSS vars) + global utilities
    _mui_styles.scss    # MUI overrides — do not touch
    _quill_styles.scss  # Quill overrides — do not touch

components/
  Layout/               # Navigation, links, sign-out
  MUIInputs/            # Wrapped MUI inputs (TextInput, Select, Tags, NumberInput)
  UI/                   # Custom primitives: Button, Card, Badge, Pagination, Loading, ActionDrop

context/
  Authenticated.tsx     # useAuthenticatedContext() — exposes current user
  ModalContext.tsx      # useModal() — showModal / hideModal

utils/
  classNames.ts         # cx utility — joins Tailwind class strings
  supabase/             # Supabase browser client + helpers
```

## Design tokens

**Full reference: `DESIGN_TOKENS.md`**

Semantic Tailwind tokens are defined as CSS custom properties in `globals.scss` and mapped in `tailwind.config.ts`. Always use tokens instead of raw Tailwind color classes.

### Key tokens
| Token | Use for |
|---|---|
| `bg-background` | Page bg |
| `bg-surface` | Cards, modals |
| `bg-surface-raised` | Inputs, hover rows |
| `border-border` | Dividers |
| `text-foreground` | Primary text |
| `text-muted` | Labels, captions |
| `text-subtle` | Placeholders |
| `bg-accent` / `hover:bg-accent-hover` | CTA buttons |
| `text-accent-foreground` | Text on filled accent button |
| `bg-accent-subtle text-accent-text` | Green badge / tag |
| `bg-spirits-subtle text-spirits` | Amber tag (rum, whiskey) |
| `bg-fruity-subtle text-fruity` | Rose tag (fruity drinks) |
| `bg-refreshing-subtle text-refreshing` | Sky tag (light/soda drinks) |

### Common migration patterns
```tsx
bg-white dark:bg-slate-800              → bg-surface
bg-gray-100 dark:bg-stone-900           → bg-background
bg-stone-800 / dark:bg-stone-800        → bg-surface
text-slate-900 dark:text-slate-100      → text-foreground
text-gray-400 dark:text-gray-400        → text-muted
border-slate-200 dark:border-slate-700  → border-border
bg-emerald-600 hover:bg-emerald-500     → bg-accent hover:bg-accent-hover
text-emerald-600 dark:text-emerald-400  → text-accent-text
```

### Palette — "Nocturne" (Variation A)
Light: `#f5f4f1` bg · `#ffffff` surface · `#f0eeeb` raised · `#e2ddd7` border · `#1a1714` fg · `#6b6460` muted · `#a09a95` subtle
Dark: `#0c0f0d` bg · `#141917` surface · `#1d2420` raised · `#2a332e` border · `#e8edea` fg · `#8a9a8f` muted · `#566059` subtle

## Conventions

### Components
- Functional components with explicit TypeScript prop types
- `classNames()` utility (`@/utils/classNames`) for conditional class merging — not template literals
- Client components get `"use client"` at the top; prefer server components by default
- Co-locate component-specific models/utils next to the component file

### Forms
- MUI inputs (`DebouncedTextInput`, `Select`, `Tags`, `NumberInput`) for all form fields — not native HTML inputs
- Form state with `useState`; no form library
- Server actions in `actions.ts` files co-located with the feature folder
- Errors via `enqueueSnackbar` from notistack

### Supabase
- Browser client: `createSupabaseBrowserClient()` from `@/utils/supabase/browser-client`
- Current user: `useAuthenticatedContext()` from `@/context/Authenticated`

### Routing
- `useRouter()` from `next/navigation` for programmatic navigation
- Slug-based routes for drinks: `/drinks/[slug]`

## Files to leave alone
- `app/styles/_mui_styles.scss` — MUI theme overrides
- `app/styles/_quill_styles.scss` — Quill editor overrides
- `next.config.mjs`, `postcss.config.mjs` — build config
