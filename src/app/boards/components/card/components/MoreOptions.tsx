import { useState } from "react";
import {
  DotsVerticalIcon,
  Pencil1Icon,
  TokensIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBoard } from "@/services/boards";
import { BoardProps } from "@/types/board";

type Props = {
  board: Omit<BoardProps, "columns">;
};

export const MoreOptions = ({ board }: Props) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.setQueryData(["boards"], (updater: BoardProps[]) => {
        return updater.filter((item) => item.id !== board.id);
      });
    },
  });

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex gap-2 items-center">
          <DotsVerticalIcon className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
            <Pencil1Icon className="w-4 h-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => setModalOpen(true)}
          >
            <TrashIcon className="w-4 h-4" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog onOpenChange={(value) => setModalOpen(value)} open={modalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir quadro?</DialogTitle>
            <DialogDescription>
              Você deseja realmente excluir o quadro{" "}
              <strong>{board.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              className="flex gap-2"
              onClick={async () => await mutateAsync(board.id)}
              disabled={isPending}
            >
              {isPending && (
                <TokensIcon className="w-4 h-4 animate-spin duration-2000" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
