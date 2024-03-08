"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { fetchBoard } from "@/services/boards";
import { useStoreAuth } from "@/store";

import { MoreOptions } from "./components/more-options";

export const BoardCards = () => {
  const router = useRouter();
  const { user } = useStoreAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["boards", user?.id],
    queryFn: () => fetchBoard(user?.id ?? ""),
    enabled: Boolean(user?.id),
  });

  if (isPending) {
    return "Loading component";
  }

  if (error) {
    console.log(error.message);
    return "An error occurred.. :/";
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {data.map((item: any) => {
        return (
          <div
            key={item.id}
            className="bg-card rounded-lg p-4 flex flex-col justify-between gap-2 shadow-card-border"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>{item.name}</span>
                <MoreOptions />
              </div>
              <span className="text-sm text-muted-foreground">
                {dayjs(item.created).format("DD MMM [de] YYYY [às] HH:mm")}
              </span>
            </div>
            <button
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => {
                router.push(`/b?id=${item.id}`);
              }}
            >
              <span className="font-bold">Acessar quadro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
