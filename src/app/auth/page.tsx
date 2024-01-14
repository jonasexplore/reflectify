import { getProviders } from "next-auth/react";

import { AuthContent } from "./components";

export default async function Auth() {
  const providers = await getProviders();

  return <AuthContent providers={providers} />;
}
