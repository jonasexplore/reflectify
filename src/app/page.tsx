"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-full">
      <div className="flex justify-between mx-6 py-4">
        <div>Tela inicial</div>
        <Button onClick={() => router.push("/auth")}>Entrar</Button>
      </div>
    </div>
  );
}
