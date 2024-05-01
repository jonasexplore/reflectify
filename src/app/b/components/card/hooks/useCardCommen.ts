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

    const card = cards.get(id);
    if (card) {
      card.comments.push({
        content: comment,
        id: nanoid(),
        boardId: card.boardId,
        cardId: card.id,
        commentLikes: [],
        timestamp: new Date().toISOString(),
        userId: user.id,
      });

      cards.set(card.id, card);
    }

    const update = {
      cards,
    };

    set(update);
    socket?.emit(
      "update:board",
      JSON.stringify({ ...update, cards: Array.from(update.cards) })
    );

    setComment("");
  }

  return { comment, setComment, handleComment };
};
