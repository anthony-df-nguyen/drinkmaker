# Drinkmaker PRD

## Core Problem Statements
Drinkmaker is a web app to help people create and share cocktails. The core reason it is being built is due to the following problems:
- Viewing drink recipes online is annoying because people put way too much text content too push their brand or SEO. People looking to make drinks just need to get to the point of what the recipe is for drinks.
- When getting to recipe, sometimes the unit of measurement isn't what I have ready. Sometimes I want ingredients in fluid ounces, sometimes i want them in ML. I don't want to do math.
- When trying to make multiple servings of something, I have to do math to get the right amount of ingredients, and I don't want to do that math.
- I often have a mix of alcohol and ingredients at home and want to know what I can make with those ingredients, or know if im just missing 1 or 2 ingredients away from making a great drink.

## Requirements

### Authentication

- A user shall be able to access the website without logging in
- Users may login using their Google or Github accounts. In the future we can add more providers.
- A user shall be able to log out of their account

### User Profile Feature
- A user shall be able to see their profile and a picture if it exists. If not, then a monogram
- A user shall be able to set their display name if the default that is set on login is not to their satisfaction
- A user shall be able to see which provider they authenticated with, their email on file, what their user ID is, and when their account was created

### Ingredients
- Authenticated users shall be able to create an ingredient with just the name
- The system shall automatically sanitize ingredient names so that users can't submit duplicate Ingredients. This serves as a site-wide collection of ingredients that users can select from when creating drink recipes.
- The uniqueness of the ingredient name is critical because it will be used later for the reverse-drink finder where user select an ingredient to see what can be made with it.
- Users shall be able to text search for ingredients
- The system shall have infinite scroll for ingredients

### Finding Drinks
There will be a Drinks page
- All users shall be able to see a list of all created drink recipes on the site
- The system shall infinitely scroll
- Users shall be able to text search for Drinks
- Users shall be able to filter for drinks they've favorited

#### Viewing a Drinks
All users can view any created drink
- They shall be able to see the drink name, description, classification, image (if it exists), ingredients, quantities, and instructions
- They shall be able to favorite/unfavorite a drink

### Creating Drinks
Only authenticated users will be allowed to create drinks.
- A user can create a drink and must provide a name for the drink
- A user must classify the drink between cocktail, mocktail, coffee, juice, etc.
- A user shall select which ingredients go into a drink, using the list of ingredients that is shared site wide
- A user must specify how many of each ingredient is required along with the unit size like (oz, dashes, pieces, ml, etc.)
- The system shall provide a diverse set of unit measurement (oz, dashes, pieces, ml, etc.)
- A user can optionally put a drink description
- A user can optionally put an image URL for the drink
- A user can optionally enter in instructions with basic rich text formatting.

### Editing Drinks
Only the creator of a drink can modify a drink.
- They shall be able to modify the name, description, classification, image URL, ingredients, ingredient quantities, and instructions
- They shall be able to delete a drink

### Sharing Drinks
A user shall be able to share a drink recipe through a URL.

### Reverse Drink Lookup (Not yet built in my app)
- A user shall be able to select a combination of ingredients and see what kind of drinks can be made with those ingredients.
- Drinks that a user has all ingredients for rank higher.
- Drinks that are only missing a handful of ingredients still appear but rank lower. The UI will show the user what is missing to make that drink.

## Technical Requirements

- This is a webapp that a user shall be able to visit on Chrome, Safari, Edge, Firefox
- Assume majority of users will be on mobile devices like Android and iPhone
- There will be a very small amount using this on ipad and desktop.
- We use NextJS
- We use Tailwind
- We must support light and dark mode
- Use supabase which manages our databases AND our user management/authentication.