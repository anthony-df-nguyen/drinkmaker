import type { Metadata } from "next";
import { AuthenticatedProvider } from "@/context/Authenticated";
import { Inter } from "next/font/google";
import { ModalProvider } from "@/context/ModalContext";
import { ThemeProvider } from "next-themes";
import "./styles/globals.scss";

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
    <html lang="en" className="h-full " suppressHydrationWarning >
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>

      <body className="h-full bg-gray-100 dark:bg-stone-900 dark:text-gray-400">
        <AuthenticatedProvider>
          <ModalProvider>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
          </ModalProvider>
        </AuthenticatedProvider>
      </body>
    </html>
  );
}
