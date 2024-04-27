import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { UniqueIdentifier } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";

import { toast } from "@/components/ui/use-toast";
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

  function setHideCards(value: boolean) {
    const update = { hideCards: value };

    set(update);
    socket?.emit("update:board", JSON.stringify(update));
  }

  function handleAddColumn() {
    if (containers.length >= 5) {
      toast({
        title: "Ação não permitida",
        description: "O máximo de colunas foi atingido!",
      });

      return;
    }

    unstable_batchedUpdates(() => {
      const newContainerId = nanoid();

      const update = {
        items: { ...items, [newContainerId]: [] },
        containersIds: [...containersIds, newContainerId],
        containers: [
          ...containers,
          {
            color: "red",
            id: newContainerId,
            name: "Nova coluna",
          },
        ],
      };

      set(update);
      socket?.emit("update:board", JSON.stringify(update));
    });
  }

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

      toast({
        title: "Quadro Salvo!",
        description: "O seu quadro foi salvo com sucesso :)",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Não foi possível salvar o quadro!",
        description:
          "Algo deu errado ao salvar o quadro, tente novamente em alguns minutos",
      });
    } finally {
      setLoading(false);
    }
  }, [cards, containers, containersIds, id, items, user?.id]);

  return {
    board,
    loading,
    hideCards,
    setHideCards,
    handleUpdate,
    handleAddColumn,
  };
};
