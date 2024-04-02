import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { nanoid } from "nanoid";

import { useStoreAuth, useStoreBoard } from "@/store";

type Props = {
  id: UniqueIdentifier;
};

export const useCardComment = ({ id }: Props) => {
  const { cards, set, socket } = useStoreBoard();
  const { user } = useStoreAuth();

  const [comment, setComment] = useState("");

  function handleComment() {
    if (!user?.id) {
      return;
    }

    const update = {
      cards: cards.map((card) => {
        if (card.id !== id) {
          return card;
        }

        return {
          ...card,
          comments: [
            ...card.comments,
            {
              content: comment,
              id: nanoid(),
              boardId: card.boardId,
              cardId: card.id,
              commentLikes: [],
              timestamp: new Date().toISOString(),
              userId: user.id,
            },
          ],
        };
      }),
    };

    set(update);
    socket?.emit("update:board", JSON.stringify(update));

    setComment("");
  }

  return { comment, setComment, handleComment };
};
