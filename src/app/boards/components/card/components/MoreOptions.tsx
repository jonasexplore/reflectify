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
        <DropdownMenuItem onClick={() => {}}>Editar</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
