import { useState } from "react";

import { useStoreAuth } from "@/store";
import { CardProps } from "@/types/board";

type Props = {
  card: CardProps;
};

export const useCard = ({ card }: Props) => {
  const { user } = useStoreAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const isCreator = card?.userId === user?.id;

  return {
    liked,
    isOpen,
    setLiked,
    setIsOpen,
    isCreator,
  };
};
