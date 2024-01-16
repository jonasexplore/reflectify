"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { ModeToggle } from "./boards/components/toggle";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen w-full">
      <div className="mx-6 py-4">
        <div className="flex justify-between ">
          <span className="font-bold">reflectify</span>
          <div className="flex gap-8 items-center">
            <ul className="flex gap-6">
              <li>Sobre</li>
              <li>Benefícios</li>
              <li>Planos</li>
            </ul>
            <ModeToggle />
            <Button onClick={() => router.push("/auth")}>Entrar</Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Planos</h2>

          <div className="flex gap-4">
            <div className="p-4 h-[300px] rounded-lg border w-full font-bold flex items-center justify-center">
              Gratuito
            </div>
            <div className="p-4 h-[300px] rounded-lg border w-full text-muted flex items-center justify-center">
              Em breve
            </div>
            <div className="p-4 h-[300px] rounded-lg border w-full text-muted flex items-center justify-center">
              Em breve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
