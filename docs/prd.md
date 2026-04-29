
# Product Requirements Document (PRD)

Product: Drinkmaker
Version: V1 → V2 (Core Product)
Author: Anthony Nguyen

Date: April 2026

⸻

1. 🧠 Product Overview

Drinkmaker is a mobile-first web app that enables users to:

* Quickly view drink recipes without unnecessary content
* Scale and convert ingredient measurements instantly
* Discover drinks based on available ingredients (reverse lookup)
* Save ingredients they own (pantry) to enable repeat usage

⸻

2. 🎯 Core User Jobs

Users come to Drinkmaker to:

1. Find a drink quickly
2. Execute a recipe without thinking (no math)
3. Figure out what they can make with what they have
4. Know what they’re missing to complete a drink

⸻

3. 🗺️ Core User Flows

⸻

🔍 Flow 1: Discover & View Drinks (Unauthenticated)

Entry Points

* Homepage
* Direct URL (shared drink)
* Search

⸻

Steps

User lands on Drinks page
→ Scrolls or searches
→ Selects a drink
→ Views drink details
→ (Optional) adjusts servings / units
→ (Optional) favorites (prompts login)

⸻

Functional Requirements

Drinks List

* Infinite scroll
* Search by name
* Basic filtering (future: favorites)

⸻

Drink Detail Page

User can view:

* Name
* Description
* Classification
* Ingredients (with quantities + units)
* Instructions
* Image (optional)

⸻

Interactions

1. Serving Scaling

* User adjusts serving size
* System recalculates all ingredient quantities instantly

2. Unit Conversion

* Toggle:
    * oz ↔ ml
* Only applies to convertible units

⸻

Success Criteria

* User reaches recipe in <3 seconds
* No manual math required

⸻

🍸 Flow 2: Create a Drink (Authenticated)

Entry Point

* “Create Drink” CTA

⸻

Steps

User opens create form
→ Enters drink name
→ Selects classification
→ Adds ingredients
→ Sets quantities + units
→ (Optional) sets ingredient role (required/optional/garnish)
→ Adds description/image/instructions
→ Submits
→ Redirect to drink page

⸻

Functional Requirements

Required Fields

* Name
* Classification
* At least 1 ingredient

⸻

Ingredient Selection (CRITICAL FLOW)

User types ingredient
→ System shows autocomplete results
→ User selects existing OR creates new

⸻

Ingredient Configuration

For each ingredient:

- ingredient_id
- quantity
- unit
- role (default: required)

Role options:

* required
* optional
* garnish

⸻

Constraints

* Ingredient must be selected (no raw free text)
* Ingredient names are globally unique (normalized)

⸻

Success Criteria

* <10 seconds to add first ingredient
* No duplicate ingredient creation

⸻

🧪 Flow 3: Reverse Drink Lookup (Core Feature)

Entry Point

* “What can I make?” CTA

⸻

Steps

User opens reverse lookup
→ Selects ingredients
→ Submits
→ System returns ranked drink list
→ User selects drink
→ Views missing ingredients

⸻

Functional Requirements

Ingredient Selection

* Search + autocomplete
* Multi-select
* (Future) preload from pantry

⸻

Results Display

Each drink shows:

* Name
* Match status:
    * Can make now
    * Missing ingredients
* Missing ingredient list

⸻

Ranking Logic

System calculates:

required_matches
optional_matches
garnish_matches
missing_required

Ranking priority:

1. No missing required ingredients
2. Fewest missing required ingredients
3. Highest match percentage
4. Optional/garnish completeness

⸻

UX States

Full Match

“You can make this now”

Partial Match

“You’re missing: X, Y”

⸻

Success Criteria

* Results returned in <500ms
* User understands what they can make instantly

⸻

🧺 Flow 4: Pantry (Authenticated, Retention Feature)

Entry Point

* Pantry page
* Reverse lookup prompt

⸻

Steps

User adds ingredients to pantry
→ Pantry is saved
→ User runs reverse lookup
→ System auto-uses pantry ingredients
→ User sees personalized results

⸻

Functional Requirements

* Add/remove ingredients
* Persist per user
* Auto-integrate with reverse lookup

⸻

UX Enhancements

* “Based on your pantry”
* Highlight drinks user can make immediately

⸻

Success Criteria

* Increased repeat usage
* Reduced input friction

⸻

❤️ Flow 5: Favorites

Steps

User clicks favorite on drink
→ Drink saved
→ User can filter/view favorites

⸻

Requirements

* Toggle favorite
* Persist per user

⸻

🔗 Flow 6: Sharing

Steps

User opens drink
→ Shares URL
→ Recipient lands on drink page

⸻

Requirements

* Public, no auth required
* SEO-friendly URLs

⸻

4. ⚙️ System Behavior

⸻

Ingredient System

* Global ingredient list
* Normalized names (lowercase, trimmed)
* Prevent duplicates
* Future: alias support

⸻

Units

Supported:

* oz
* ml
* dash
* piece

Rules:

* Only convert compatible units
* Leave non-convertible units unchanged

⸻

Ingredient Roles

Stored per drink:

required
optional
garnish

Used in:

* reverse lookup ranking
* UI messaging

⸻

5. 📊 Analytics (Product-Focused)

Track events:

drink_viewed
drink_created
ingredient_selected
reverse_lookup_started
reverse_lookup_completed
pantry_updated
drink_favorited

⸻

6. ⚠️ Edge Cases

* Duplicate ingredient creation → prevent via normalization
* Unit mismatch → fallback to original unit
* No reverse lookup results → show suggestions
* Missing optional/garnish → do not block

⸻

7. 🗺️ Feature Breakdown (Build Order)

Phase 1 (MVP)

* Auth
* Ingredient system (basic)
* Drink CRUD
* Drink viewing
* Search

⸻

Phase 2 (Core Product)

* Reverse lookup
* Ingredient roles
* Unit conversion
* Serving scaling

⸻

Phase 3 (Retention + Growth)

* Pantry
* Favorites filtering
* Sharing optimization

⸻

🔥 Final Product Definition

Drinkmaker is:

👉 A decision engine that helps users instantly determine what drinks they can make and how to make them with minimal effort.

⸻

If you want next step, I can:

* convert this into Jira epics + AC in Gherkin format
* map each flow to Next.js routes + API endpoints
* or design your Supabase queries for reverse lookup (this is the hardest part technically)