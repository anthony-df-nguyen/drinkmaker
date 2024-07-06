"use client";
import Navigation from "@/components/Layout/Navigation";
import ProfilePage from "./ProfilePage"; 

export default function Home() {
  return (
    <main className="pageTitle">
      <Navigation>
        <ProfilePage />
      </Navigation>
    </main>
  );
}
