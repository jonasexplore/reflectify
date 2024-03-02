import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "../components/ui/theme-provider";

import { AuthProvider } from "./auth/components";
import Providers from "./providers";

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
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="h-screen">
            <AuthProvider>
              <Providers>{children}</Providers>
              <Toaster />
            </AuthProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
