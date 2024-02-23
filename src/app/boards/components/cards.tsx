"use client";

import { useCallback } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { fetchBoard } from "@/services/boards";
import { useStoreAuth } from "@/store";

export const BoardCards = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useStoreAuth();

  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete(name);
        return "";
      }

      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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
    <div className="flex gap-2">
      {data.map((item: any) => {
        return (
          <div
            key={item.id}
            className="bg-container border rounded-lg p-4 flex flex-col justify-between gap-2 border-l-2 border-l-fuchsia-600"
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>{item.name}</span>
                <TrashIcon className="w-4 h-4 text-red-400" />
              </div>
              <Badge variant="default">retrospectiva</Badge>
              <span className="text-sm text-muted-foreground">
                Data de criação:{" "}
                {dayjs(item.created).format("DD/MM/YYYY [às] HH:mm")}
              </span>
            </div>
            <button
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => redirect(`/boards/${item.id}`)}
            >
              <span className="font-bold">Acessar quadro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      <button
        key={"random"}
        className="rounded-lg border border-dashed border-slate-600 p-4 flex flex-col justify-center items-center"
        onClick={() => {
          router.push(
            `${pathname}?${createQueryString("createBoardModalIsOpen", "true")}`
          );
        }}
      >
        <span>Criar novo quadro</span>
        <PlusIcon className="w-8 h-8" />
      </button>
    </div>
  );
};
