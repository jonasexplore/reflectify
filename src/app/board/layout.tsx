import { Navbar } from "./components/navbar";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="h-screen flex flex-col gap-4 mx-6 py-4">
        <Navbar />
        {children}
      </div>
    </main>
  );
}
