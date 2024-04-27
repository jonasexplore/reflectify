import { Metadata } from "next";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Meus quadros | reflectify",
  description: "Gerencie seus quadros",
};

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <Navbar />
      {children}
    </div>
  );
}
