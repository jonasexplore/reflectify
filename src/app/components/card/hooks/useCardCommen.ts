import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import { useStoreBoard } from "@/app/store";

type Props = {
  id: UniqueIdentifier;
};

export const useCardComment = ({ id }: Props) => {
  const { cards, setCards } = useStoreBoard();

  const [comment, setComment] = useState("");

  function handleComment() {
    setCards(
      cards.map((card) => {
        if (card.id !== id) {
          return card;
        }

        return {
          ...card,
          comments: [
            ...card.comments,
            {
              content: comment,
              id: window.crypto.randomUUID(),
              likes: [],
              timesteamp: new Date().toISOString(),
              userId: window.crypto.randomUUID(),
            },
          ],
        };
      })
    );
    setComment("");
  }

  return { comment, setComment, handleComment };
};
