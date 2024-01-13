import { ExitIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Avatar = () => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 items-center">
        <span className="font-semibold">Jonas Brito</span>
        <Image
          className="rounded-full"
          width={32}
          height={32}
          alt="profile"
          src="https://avatars.githubusercontent.com/u/53955982?v=4"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push("/auth");
          }}
          className="flex gap-2 cursor-pointer"
        >
          <ExitIcon className="w-4 h-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
