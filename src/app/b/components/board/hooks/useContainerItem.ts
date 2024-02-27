import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useStoreBoard } from "@/store";

type Props = {
  id: UniqueIdentifier;
};

export const useContainerItem = ({ id }: Props) => {
  const { cards } = useStoreBoard();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const card = cards.find((item) => item.id === id);

  return { card, attributes, listeners, setNodeRef, isDragging, style };
};
