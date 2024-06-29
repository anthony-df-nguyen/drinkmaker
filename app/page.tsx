"use client";
import Navigation from "@/components/Layout/Navigation";
import { ListDrinksProvider } from "./drinks/contexts/DrinksContext";
import DrinksPage from "./drinks/DrinksPage";

export default function Home() {
  return (
    <main className="pageTitle">
      <Navigation>
        <ListDrinksProvider>
          <DrinksPage />
        </ListDrinksProvider>
      </Navigation>
    </main>
  );
}
