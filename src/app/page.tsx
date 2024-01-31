"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import logo from "../../public/logo.svg";

import { ModeToggle } from "./boards/components/toggle";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen w-full">
      <div className="mx-6 py-4">
        <div className="flex justify-between ">
          <div className="flex gap-2 items-center">
            <Image alt="logo" src={logo} className="w-4 h-4" />
            <span className="font-bold">reflectify</span>
          </div>
          <div className="flex gap-8 items-center">
            <ModeToggle />
            <Button onClick={() => router.push("/auth")}>Entrar</Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">Planos</h2>

          <div className="flex gap-4">
            <div className="rounded-lg border w-full flex flex-col">
              <div className="flex flex-col gap-4 p-4">
                <span className="text-sm text-muted-foreground">GRATUITO</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(0)}
                  </span>
                  <span>Ideal para uso individual</span>
                </div>
                <Button>Começar agora</Button>
              </div>
            </div>
            <div className="rounded-lg border-2 border-fuchsia-400 w-full flex flex-col">
              <div className="flex flex-col gap-4  p-4">
                <span className="text-sm text-muted-foreground">PADRÃO</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(9.98)}
                  </span>
                  <span>Ideal para uso individual</span>
                </div>
                <Button>Começar agora</Button>
              </div>
            </div>
            <div className="rounded-lg border w-full flex flex-col">
              <div className="flex flex-col gap-4  p-4">
                <span className="text-sm text-muted-foreground">EMPRESA</span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(17.98)}
                  </span>
                  <span>Ideal para uso individual</span>
                </div>
                <Button>Começar agora</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
