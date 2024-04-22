import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";

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
  const queryClient = useQueryClient();

  const { mutateAsync: handleDeleteCard } = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.setQueryData(["boards"], (updater: BoardProps[]) => {
        return updater.filter((item) => item.id !== board.id);
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 items-center">
        <MoreHorizontal className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
          <PencilSquareIcon className="w-4 h-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={async () => await handleDeleteCard(board.id)}
        >
          <TrashIcon className="w-4 h-4" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
