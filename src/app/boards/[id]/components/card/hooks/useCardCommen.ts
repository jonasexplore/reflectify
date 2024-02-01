import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { nanoid } from "nanoid";

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
              id: nanoid(),
              likes: [],
              timesteamp: new Date().toISOString(),
              userId: "4b94ffe5-d0e3-4f2f-adfb-f0b08a3cf9f7",
            },
          ],
        };
      })
    );
    setComment("");
  }

  return { comment, setComment, handleComment };
};
