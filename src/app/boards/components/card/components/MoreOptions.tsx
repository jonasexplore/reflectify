import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MoreOptions = () => {
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
        <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
          <TrashIcon className="w-4 h-4" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
