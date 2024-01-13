"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import logo from "../../../public/logo.svg";
import { ModeToggle } from "../boards/components/toggle";

import { AuthForm } from "./components/Form";

export default function Auth() {
  const router = useRouter();

  return (
    <div className="h-screen">
      <div className="grid grid-cols-2">
        <div className="h-screen bg-container flex flex-col justify-between">
          <div className="p-4">
            <div className="flex gap-2 items-center ">
              <Image alt="logo" src={logo} className="w-4 h-4" />
              <span className="font-bold">reflectify</span>
            </div>
          </div>

          <div className="p-4 text-muted-foreground">
            <span>
              Reflectify é a ferramenta perfeita para equipes de desenvolvimento
              otimizarem suas retrospectivas. Facilitando a criação de cards
              personalizados, a aplicação web torna as reuniões mais eficientes,
              promovendo uma reflexão colaborativa e identificação de melhorias.
              Transforme suas retrospectivas com o Reflectify.
            </span>
          </div>
        </div>
        <div className="h-screen border-l flex flex-col items-center justify-center">
          <div className="w-full px-6 py-4 flex gap-2 justify-end">
            <ModeToggle />
            <Button
              onClick={() => {
                const boardId = window.crypto.randomUUID();
                router.push(`/board/${boardId}`);
              }}
            >
              Login
            </Button>
          </div>
          <div className=" flex-1 flex flex-col justify-center gap-4 space-y-2">
            <div className="flex flex-col">
              <span className="text-center text-2xl font-semibold tracking-tight">
                Crie uma conta
              </span>
              <span className="text-center text-muted-foreground">
                Digite os dados abaixo para criar sua conta
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
