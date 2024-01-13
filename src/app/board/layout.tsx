import { Suspense } from "react";

import { Navbar } from "./components/navbar";
import Loading from "./loading";

export default function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="h-screen flex flex-col gap-4 mx-6 py-4">
        <Navbar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </main>
  );
}
