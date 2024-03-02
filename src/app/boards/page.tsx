"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withAuth } from "@/components/ui/with-auth";
import { useStoreAuth } from "@/store";

import { createBoard } from "../../services/boards";

import { BoardCards } from "./components/card/Card";
import { BoardForm } from "./components/form";

function Board() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useStoreAuth();
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const open = Boolean(searchParams.get("createBoardModalIsOpen"));

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value) {
        params.delete(name);
        return params.toString();
      }

      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBoard,
    onSuccess: (data) => {
      queryClient.setQueryData(["boards", user?.id], (updater: any) => {
        return [...updater, data];
      });

      router.push(
        `${pathname}?${createQueryString("createBoardModalIsOpen", null)}`
      );

      router.push(`/b?id=${data.id}`);
    },
  });

  const handleCreateBoard = useCallback(
    async (value: { name: string; userId: string }) => {
      try {
        if (!user?.id) {
          return;
        }

        await mutateAsync({
          name: value.name,
          userId: user.id,
        });
      } catch (error) {
        console.error("erro", error);
      }
    },
    [mutateAsync, user?.id]
  );

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <div className="mb-4 flex gap-3 justify-end">
          <Input placeholder="Busque pelo nome do quadro..." />
          <Select defaultValue="date">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Ordenar por data</SelectItem>
              <SelectItem value="name">Ordenar por nome</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              router.push(
                `${pathname}?${createQueryString(
                  "createBoardModalIsOpen",
                  "true"
                )}`
              );
            }}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm">Criar novo quadro</span>
          </Button>
        </div>

        <BoardCards />

        <Dialog
          onOpenChange={(value) => {
            router.push(
              `${pathname}?${createQueryString(
                "createBoardModalIsOpen",
                value ? String(value) : null
              )}`
            );
          }}
          open={open}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo quadro</DialogTitle>

              <div>
                <BoardForm
                  loadingButton={isPending}
                  onSubmit={handleCreateBoard}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default withAuth(Board);
