import type { Metadata } from "next";
import { AuthenticatedProvider } from "@/context/Authenticated";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body className="h-full">
        <AuthenticatedProvider>{children}</AuthenticatedProvider>
      </body>
    </html>
  );
}
