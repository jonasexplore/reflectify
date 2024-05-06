import { useCallback, useEffect, useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";

import { toast } from "@/components/ui/use-toast";
import { updateBoard } from "@/services/boards";
import { useStoreAuth, useStoreBoard } from "@/store";
import { CardProps } from "@/types/board";

export type UpdateCardInput = {
  userId: string;
  content: string;
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  comments: CardProps["comments"];
  likes: CardProps["likes"];
};

export const useBoardHeader = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    items,
    cards,
    containers,
    containersIds,
    board,
    set,
    socket,
    hideCards,
  } = useStoreBoard();
  const { user } = useStoreAuth();
  const [loading, setLoading] = useState(false);
  const [hasChange, setHasChange] = useState(false);

  function setHideCards(value: boolean) {
    const update = { hideCards: value };

    set(update);
    socket?.emit("update:board", JSON.stringify(update));
  }

  const handleAddColumn = useCallback(() => {
    if (containers.length >= 5) {
      toast({
        title: "Ação não permitida",
        description: "O máximo de colunas foi atingido!",
      });

      return;
    }

    const newContainerId = nanoid();

    const update = {
      items: { ...items, [newContainerId]: [] },
      containersIds: [...containersIds, newContainerId],
      containers: [
        ...containers,
        {
          id: newContainerId,
          name: "Nova coluna",
        },
      ],
    };

    set(update);
    socket?.emit("update:board", JSON.stringify(update));
  }, [containers, containersIds, items, set, socket]);

  const { mutateAsync } = useMutation({
    mutationFn: updateBoard,
  });

  const handleUpdate = useCallback(async () => {
    try {
      if (!user?.id || user.id !== board.userId) {
        return;
      }

      setLoading(true);

      const cardsToUpdate = Object.keys(items).reduce<UpdateCardInput[]>(
        (acc, curr) => {
          const item = items[curr];
          const cardsFromColumn = item.map((id) => {
            const card = cards.get(id) as CardProps;

            return {
              id,
              columnId: curr,
              content: card?.content,
              userId: user.id,
              comments: card.comments,
              likes: card.likes,
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

      await mutateAsync({
        boardId: id as string,
        input: {
          cards: cardsToUpdate,
          columns,
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [cards, containers, containersIds, id, items, mutateAsync, user?.id]);

  useEffect(() => {
    if (loading || !hasChange) {
      return;
    }

    const id = setInterval(() => {
      handleUpdate();
      setHasChange(false);
    }, 10000);

    return () => clearInterval(id);
  }, [handleUpdate, hasChange, loading]);

  useEffect(() => {
    if (cards || containers || containersIds || items) {
      setHasChange(true);
    }
  }, [cards, containers, containersIds, items]);

  return {
    board,
    loading,
    hideCards,
    setHideCards,
    handleUpdate,
    handleAddColumn,
  };
};
