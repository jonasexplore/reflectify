import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";

import { SortKeys } from "@/app/boards/hooks/useBoards";
import { fetchBoard } from "@/services/boards";

export type BoardCardsProps = {
  orderBy?: SortKeys;
  search?: string;
};

export const useBoardCards = ({ orderBy, search }: BoardCardsProps) => {
  const session = useSession();

  const { isPending, data } = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoard,
    enabled: Boolean(session.status === "authenticated"),
  });

  const filtered = useMemo(() => {
    let items = data ?? [];

    if (orderBy === "date") {
      items.sort(
        (a, b) => dayjs(b.created).valueOf() - dayjs(a.created).valueOf()
      );
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (search) {
      items = items?.filter((item) =>
        item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }

    return items;
  }, [data, orderBy, search]);

  return {
    isPending,
    filtered,
  };
};
