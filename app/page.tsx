"use client";
import Navigation from "@/components/Layout/Navigation";
import { ListDrinksProvider } from "./drinks/contexts/DrinksContext";
import DrinksPage from "./drinks/DrinksPage";
import { useTheme } from "next-themes";

export default function Home() {
  return (
    <main className="pageTitle">
      <Navigation>
        <div className="max-w-[860px] mx-auto">
          <ListDrinksProvider>
            <DrinksPage />
          </ListDrinksProvider>
        </div>
      </Navigation>
    </main>
  );
}
