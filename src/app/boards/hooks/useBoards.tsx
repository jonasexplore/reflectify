import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createBoard } from "@/services/boards";
import { createQueryString } from "@/utils/create-query-string";

export type SortKeys = "name" | "date";

export const useBoards = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const open = Boolean(searchParams.get("creating-board"));

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortKeys>("date");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBoard,
    onSuccess: (data) => {
      queryClient.setQueryData(["boards"], (updater: any) => {
        return [...updater, data];
      });

      router.push(
        `${pathname}?${createQueryString(
          searchParams,
          ["creating-board"],
          [null]
        )}`
      );

      router.push(`/b?id=${data.id}`);
    },
  });

  const handleCreateBoard = useCallback(
    async (value: { name: string; isPublic: boolean }) => {
      try {
        await mutateAsync({
          name: value.name,
          isPublic: value.isPublic,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [mutateAsync]
  );

  return {
    open,
    sort,
    router,
    search,
    setSort,
    pathname,
    setSearch,
    isPending,
    searchParams,
    createQueryString,
    handleCreateBoard,
  };
};
