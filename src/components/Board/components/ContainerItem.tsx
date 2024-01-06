"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/Card";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useStoreBoard } from "@/app/store";
import { DetailedHTMLProps, HTMLAttributes, useRef } from "react";

type Props = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "id"
> & {
  id: UniqueIdentifier;
};

export const SortableItem = ({ id, className, ...props }: Props) => {
  const divElement = useRef<any>();
  const { cards } = useStoreBoard();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const card = cards.find((item) => item.id === id);

  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
  };

  return (
    <div
      {...props}
      ref={(element) => {
        setNodeRef(element);
        divElement.current = element;
      }}
      style={{
        ...style,
        ...props.style,
        opacity: isDragging ? "0.5" : undefined,
      }}
    >
      <Card attributes={attributes} listeners={listeners} cardInfo={card}>
        {card?.content}
      </Card>
    </div>
  );
};
