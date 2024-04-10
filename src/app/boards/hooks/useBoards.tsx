import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createBoard } from "@/services/boards";
import { useStoreAuth } from "@/store";
import { createQueryString } from "@/utils/create-query-string";

export const useBoards = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useStoreAuth();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const open = Boolean(searchParams.get("creating-board"));

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBoard,
    onSuccess: (data) => {
      queryClient.setQueryData(["boards", user?.id], (updater: any) => {
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
        if (!user?.id) {
          return;
        }

        await mutateAsync({
          name: value.name,
          userId: user.id,
          isPublic: value.isPublic,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [mutateAsync, user?.id]
  );

  return {
    open,
    router,
    pathname,
    isPending,
    searchParams,
    createQueryString,
    handleCreateBoard,
  };
};
