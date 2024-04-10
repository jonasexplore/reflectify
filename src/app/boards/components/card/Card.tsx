"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { fetchBoard } from "@/services/boards";
import { useStoreAuth } from "@/store";

import { MoreOptions } from "./components/MoreOptions";

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
      {data.map((item) => {
        return (
          <div
            key={item.id}
            className="bg-card rounded-lg p-4 flex flex-col justify-between gap-2 shadow-card-border"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/b?id=${item.id}`);
                  }}
                >
                  {item.name}
                </button>
                <MoreOptions />
              </div>
              <span className="text-sm text-muted-foreground">
                {dayjs(item.created).format("DD MMM [de] YYYY [às] HH:mm")}
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
