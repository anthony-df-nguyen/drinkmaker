"use client";
import Navigation from "@/components/Layout/Navigation";
import { ListDrinksProvider } from "./drinks/contexts/DrinksContext";
import DrinksPage from "./drinks/DrinksPage";
import { useTheme } from "next-themes";

export default function Home() {
  const {theme, setTheme} = useTheme();

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
