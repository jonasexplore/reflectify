"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/Card";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useStoreBoard } from "@/app/store";
import { useRef } from "react";

type Props = {
  id: UniqueIdentifier;
  wrapperStyle?: any;
};

export const SortableItem = ({ id, wrapperStyle }: Props) => {
  const divElement = useRef<any>();
  const { cards } = useStoreBoard();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    active,
    over,
  } = useSortable({ id });

  const card = cards.find((item) => item.id === id);

  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        divElement.current = element;
      }}
      style={
        {
          ...wrapperStyle,
          transform: CSS.Translate.toString(
            transform && {
              ...transform,
              scaleY: 1,
            }
          ),
          height: divElement.current?.clientHeight,
          transition: [transition, wrapperStyle?.transition]
            .filter(Boolean)
            .join(", "),
          "--translate-x": transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          "--translate-y": transform
            ? `${Math.round(transform.y)}px`
            : undefined,
          "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
          "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
        } as React.CSSProperties
      }
      className={isDragging ? "opacity-50" : "cursor-grab"}
      {...attributes}
      {...listeners}
    >
      <Card>{card?.content}</Card>
    </div>
  );
};
