"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Profile = () => {
  const { data: session } = useSession();

  const userIsLogout = !session?.user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 items-center">
        <Avatar>
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback>{session?.user?.name?.[0] ?? "A"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {!userIsLogout && (
        <DropdownMenuContent>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              localStorage.removeItem("identifier");
              signOut({ callbackUrl: "http://localhost:3000/" });
            }}
            className="flex gap-2 cursor-pointer"
          >
            <ExitIcon className="w-4 h-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}

      {userIsLogout && (
        <DropdownMenuContent>
          <DropdownMenuLabel>Usuário anônimo</DropdownMenuLabel>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
