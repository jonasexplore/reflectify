import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "reflectify",
  description: "reflect your mind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen flex flex-col gap-4 mx-6 py-4">
            <Navbar />
            <main className="h-full">{children}</main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
