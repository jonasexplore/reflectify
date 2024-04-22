"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { fetchBoard } from "@/services/boards";
import { useStoreAuth } from "@/store";

import { SortKeys } from "../../hooks/useBoards";

import { MoreOptions } from "./components/MoreOptions";

type Props = {
  orderBy?: SortKeys;
  search?: string;
};

export const BoardCards = ({ orderBy, search }: Props) => {
  const { user } = useStoreAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["boards"],
    queryFn: () => fetchBoard(),
    enabled: Boolean(user?.id),
  });

  const filtered = useMemo(() => {
    let items = data ?? [];

    if (orderBy === "date") {
      items.sort(
        (a, b) => dayjs(b.created).valueOf() - dayjs(a.created).valueOf()
      );
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (search) {
      items = items?.filter((item) =>
        item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }

    return items;
  }, [data, orderBy, search]);

  if (isPending) {
    return "Loading component";
  }

  if (error) {
    console.log(error.message);
    return "An error occurred.. :/";
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
                <Link target="_blank" href={`/b?id=${item.id}`}>
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
