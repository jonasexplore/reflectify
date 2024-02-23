"use client";

import { useCallback, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { withAuth } from "@/components/ui/with-auth";
import { useStoreAuth } from "@/store";

import { createBoard } from "../../services/boards";

import { BoardCards } from "./components/cards";
import { BoardForm } from "./components/form";

const queryClient = new QueryClient();

function Board() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useStoreAuth();
  const [isClient, setIsClient] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const searchParams = useSearchParams();
  const open = Boolean(searchParams.get("createBoardModalIsOpen"));

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

  if (!isClient) {
    return;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h2 className="font-bold text-lg mb-6">Todos os meus quadros:</h2>
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
                  loadingButton={loadingButton}
                  onSubmit={handleCreateBoard}
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </QueryClientProvider>
  );
}

export default withAuth(Board);
