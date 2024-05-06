import { useState } from "react";

import { useStoreAuth, useStoreBoard } from "@/store";
import { CardProps } from "@/types/board";

type Props = {
  card: CardProps;
};

export const useCard = ({ card }: Props) => {
  const { user } = useStoreAuth();
  const { hideCards } = useStoreBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(
    card?.likes?.some((like) => like.userId === user?.id)
  );

  return {
    liked,
    isOpen,
    setLiked,
    setIsOpen,
    hideCards,
  };
};
