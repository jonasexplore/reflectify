"use client";
import { BoardContext } from "@/components/Board/BoardContext";
import { useContext, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

type Props = {
  index: number;
  listIndex: number;
};

export const useCard = ({ index, listIndex }: Props) => {
  const DRAG_TYPE = "CARD";

  const { move } = useContext(BoardContext);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    item: {
      index,
      listIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    type: DRAG_TYPE,
  });

  const [, dropRef] = useDrop({
    accept: [DRAG_TYPE],
    hover: (
      item: {
        type: string;
        index: number;
        listIndex: number;
      },
      monitor
    ) => {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      const draggedOffset = monitor.getClientOffset();

      if (
        (draggedIndex === targetIndex &&
          draggedListIndex === targetListIndex) ||
        !ref.current ||
        !draggedOffset
      ) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedTop = draggedOffset.y - targetSize.top;

      if (
        (draggedIndex < targetIndex && draggedTop < targetCenter) ||
        (draggedIndex > targetIndex && draggedTop > targetCenter)
      ) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.index = targetIndex;
      item.listIndex = targetListIndex;
    },
  });

  dragRef(dropRef(ref));

  return {
    ref,
    isDragging,
  };
};
