"use client";

import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { withAuth } from "@/components/ui/with-auth";

import Loading from "../loading";

function Board() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return isClient ? (
    <div className="h-full">
      <h2 className="font-bold text-lg mb-6">Todos os meus quadros:</h2>

      <div className="flex gap-2">
        {[1, 2].map((item) => {
          return (
            <div
              key={item}
              className="bg-container border rounded-lg p-4 flex flex-col justify-between gap-2 border-l-2 border-l-fuchsia-600"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Retrospectiva 13/01/2024</span>
                  <TrashIcon className="w-4 h-4 text-red-400" />
                </div>
                <Badge variant="default">retrospectiva</Badge>
                <span className="text-sm text-muted-foreground">
                  Data de criação: {dayjs().format("DD/MM/YYYY [às] HH:mm")}
                </span>
              </div>
              <button
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => router.push(`/boards/${item}`)}
              >
                <span className="font-bold">Acessar quadro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        <div
          key={"random"}
          className="rounded-lg border border-dashed border-slate-600 p-4 flex flex-col justify-center items-center"
        >
          <span>Criar novo card</span>
          <PlusIcon className="w-8 h-8" />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default withAuth(Board);
