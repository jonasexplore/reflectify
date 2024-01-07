import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

type Props = {
  id: UniqueIdentifier;
};

export const useCard = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  return {
    liked,
    isOpen,
    setLiked,
    setIsOpen,
  };
};
