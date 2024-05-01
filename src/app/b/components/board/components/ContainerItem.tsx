"use client";

import { DetailedHTMLProps, HTMLAttributes } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";

import { Card } from "../../card";
import { useContainerItem } from "../hooks/useContainerItem";

type Props = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "id"
> & {
  id: UniqueIdentifier;
  handlerDeleteCard?: (id: UniqueIdentifier) => void;
};

export const SortableItem = ({
  id,
  className,
  handlerDeleteCard,
  ...props
}: Props) => {
  const { card, attributes, listeners, setNodeRef, isDragging, style } =
    useContainerItem({ id });

  if (!card) {
    return;
  }

  return (
    <div
      {...props}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        cursor: "grab",
        opacity: isDragging ? "0.5" : undefined,
        ...props.style,
      }}
    >
      <Card card={card} handlerDeleteCard={handlerDeleteCard}>
        {card.content}
      </Card>
    </div>
  );
};
