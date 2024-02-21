import { Navbar } from "./components/navbar";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-2 p-4 h-full">
      <Navbar />
      {children}
    </div>
  );
}
