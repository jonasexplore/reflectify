"use client";

import { useCallback, useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { withAuth } from "@/components/ui/with-auth";

import { createBoard, fetchBoard } from "../services/boards";
import { useStoreAuth } from "../store";

import { BoardForm } from "./components/form";

function Board() {
  const router = useRouter();
  const { user } = useStoreAuth();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const handleFetchBoards = useCallback(async () => {
    try {
      if (!user?.id) {
        return;
      }

      setLoading(true);

      const boards = await fetchBoard(user.id);

      setBoards(boards);
    } catch (error) {
      console.error("erro", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleCreateBoard = useCallback(
    async (value: { name: string; userId: string }) => {
      try {
        if (!user?.id) {
          return;
        }

        setLoadingButton(true);

        const output = await createBoard(value.name, user.id);

        router.push(`/boards/${output.id}`);
      } catch (error) {
        console.error("erro", error);
      } finally {
        setLoadingButton(false);
      }
    },
    [router, user?.id]
  );

  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    handleFetchBoards();
  }, [handleFetchBoards]);

  if (!isClient || loading) {
    return;
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-6">Todos os meus quadros:</h2>

      <div className="flex gap-2">
        {boards.map((item) => {
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
                onClick={() => router.push(`/boards/${item.id}`)}
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
          onClick={() => setOpen(true)}
        >
          <span>Criar novo quadro</span>
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>

      <Dialog onOpenChange={(value) => setOpen(value)} open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo quadro</DialogTitle>
            <DialogDescription>
              <BoardForm
                loadingButton={loadingButton}
                onSubmit={handleCreateBoard}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(Board);
