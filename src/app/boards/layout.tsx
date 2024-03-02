import { Navbar } from "./components/navbar";

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
