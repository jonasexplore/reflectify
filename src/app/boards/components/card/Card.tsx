"use client";

import { TokensIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import Link from "next/link";

import { EmptyIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

import { MoreOptions } from "./components/MoreOptions";
import { BoardCardsProps, useBoardCards } from "./hooks/useBoardCards";

export const BoardCards = (props: BoardCardsProps) => {
  const { filtered, isPending } = useBoardCards(props);

  if (isPending) {
    return (
      <div className="mt-64 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <TokensIcon className="w-8 h-8 animate-spin duration-2000" />
          <div className="flex flex-col items-center">
            <span className="font-bold">Carregando</span>
            <span className="text-muted-foreground">
              Buscando os seus quadros...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <EmptyIcon width={256} height={256} />
        <div className="flex flex-col items-center">
          <strong>Parece um pouco vazio aqui</strong>
          <span>Nenhum quadro foi encontrado D:</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {filtered.map((item) => {
        return (
          <div
            key={item.id}
            className="bg-card rounded-lg p-4 flex flex-col justify-between gap-2 shadow-card-border"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <Link href={`/b?id=${item.id}`}>
                  <button className="cursor-pointer">{item.name}</button>
                </Link>
                <MoreOptions board={item} />
              </div>
              <span className="text-sm text-muted-foreground">
                {dayjs(item.created).format("DD MMM [de] YYYY")}
              </span>
            </div>

            <div>
              <Badge>{item.isPublic ? "Público" : "Privado"}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};
