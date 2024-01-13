import { Suspense } from "react";

import AuthLoading from "./loading";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<AuthLoading />}>{children}</Suspense>;
}
