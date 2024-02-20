import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { nanoid } from "nanoid";

import { useStoreAuth, useStoreBoard } from "@/app/store";

type Props = {
  id: UniqueIdentifier;
};

export const useCardComment = ({ id }: Props) => {
  const { cards, setCards } = useStoreBoard();
  const { user } = useStoreAuth();

  const [comment, setComment] = useState("");

  function handleComment() {
    if (!user?.id) {
      return;
    }

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
              userId: user.id,
            },
          ],
        };
      })
    );
    setComment("");
  }

  return { comment, setComment, handleComment };
};
