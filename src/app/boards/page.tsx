"use client";

import { PlusIcon } from "lucide-react";

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

import { BoardCards } from "./components/card/Card";
import { BoardForm } from "./components/form";
import { useBoards } from "./hooks/useBoards";

function Board() {
  const {
    open,
    router,
    pathname,
    isPending,
    searchParams,
    handleCreateBoard,
    createQueryString,
  } = useBoards();

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <div className="mb-4 flex justify-end items-center gap-3 flex-col md:flex-row">
          <Input
            className="w-full"
            placeholder="Busque pelo nome do quadro..."
          />
          <div className="w-full md:w-auto min-w-[180px]">
            <Select defaultValue="date">
              <SelectTrigger className="w-full ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Ordenar por data</SelectItem>
                <SelectItem value="name">Ordenar por nome</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full md:w-auto"
            onClick={() => {
              router.push(
                `${pathname}?${createQueryString(
                  searchParams,
                  ["createBoardModalIsOpen"],
                  ["true"]
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
                searchParams,
                ["createBoardModalIsOpen"],
                [value ? String(value) : null]
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
