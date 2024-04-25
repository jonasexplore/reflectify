import { Navbar } from "@/components/navbar";

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <Navbar hideNavigationMenu />
      {children}
    </div>
  );
}
