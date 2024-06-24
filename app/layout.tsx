import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/context/Supabase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drink Maker",
  description: "Make drinks quickly,",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </head>
      <body className="h-full">
        {<SupabaseProvider>{children}</SupabaseProvider>}
      </body>
    </html>
  );
}
