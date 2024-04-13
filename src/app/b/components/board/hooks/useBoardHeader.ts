import { useCallback, useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSearchParams } from "next/navigation";

import { updateBoard } from "@/services/boards";
import { useStoreAuth, useStoreBoard } from "@/store";
import { CardProps } from "@/types/board";

type UpdateCardInput = {
  userId: string;
  content: string;
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
};

export const useBoardHeader = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { items, cards, containers, containersIds, board } = useStoreBoard();
  const { user } = useStoreAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdate = useCallback(async () => {
    try {
      if (!user?.id) {
        return;
      }

      setLoading(true);

      const cardsToUpdate = Object.keys(items).reduce<UpdateCardInput[]>(
        (acc, curr) => {
          const item = items[curr];
          const cardsFromColumn = item.map((id) => {
            const card = cards.find((entry) => entry.id === id) as CardProps;

            return {
              id,
              columnId: curr,
              content: card?.content,
              userId: user.id,
            };
          });

          return acc.concat(cardsFromColumn);
        },
        []
      );

      const columns = containersIds.map((id, index) => {
        const container = containers.find((item) => item.id === id);

        return {
          id: container?.id ?? "",
          name: container?.name ?? "",
          position: index,
        };
      });

      await updateBoard(id as string, {
        cards: cardsToUpdate,
        columns,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [cards, containers, containersIds, id, items, user?.id]);

  return {
    board,
    loading,
    handleUpdate,
  };
};
