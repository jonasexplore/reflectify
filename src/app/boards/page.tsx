"use client";

import { PlusIcon } from "@radix-ui/react-icons";

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
import { SortKeys, useBoards } from "./hooks/useBoards";

function Board() {
  const {
    open,
    sort,
    router,
    search,
    setSort,
    pathname,
    setSearch,
    isPending,
    searchParams,
    handleCreateBoard,
    createQueryString,
  } = useBoards();

  return (
    <div className="flex justify-center flex-1">
      <div className="flex flex-col gap-4 w-full max-w-7xl">
        <div className="flex justify-end items-center gap-3 flex-col md:flex-row">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full"
            placeholder="Busque pelo nome do quadro..."
          />
          <div className="w-full md:w-auto min-w-[180px]">
            <Select
              value={sort}
              onValueChange={(value: SortKeys) => setSort(value)}
              defaultValue={sort}
            >
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
                  ["creating-board"],
                  ["true"]
                )}`
              );
            }}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm">Criar novo quadro</span>
          </Button>
        </div>

        <BoardCards orderBy={sort} search={search} />

        <Dialog
          onOpenChange={(value) => {
            router.push(
              `${pathname}?${createQueryString(
                searchParams,
                ["creating-board"],
                [value ? String(value) : null]
              )}`
            );
          }}
          open={open}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo quadro</DialogTitle>

              <BoardForm
                loadingButton={isPending}
                onSubmit={handleCreateBoard}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default withAuth(Board);
