"use client";
import { BoardContext } from "@/components/Board/BoardContext";
import { useCallback, useContext, useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";

type Props = {
  index: number;
  listIndex: number;
};

export const useCard = ({ index, listIndex }: Props) => {
  const DRAG_TYPE = "CARD";

  const { moveCard, setIsMoving } = useContext(BoardContext);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    item: {
      index,
      listIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    isDragging: (monitor) => {
      const item = monitor.getItem();
      return item.index === index && item.listIndex === listIndex;
    },
    type: DRAG_TYPE,
  });

  const handleHover = useCallback(
    (
      item: {
        index: number;
        listIndex: number;
      },
      monitor: DropTargetMonitor<
        {
          index: number;
          listIndex: number;
        },
        unknown
      >
    ) => {
      setIsMoving(true);

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

      moveCard(
        draggedListIndex,
        targetListIndex,
        draggedIndex,
        targetIndex,
        "card"
      );

      item.index = targetIndex;
      item.listIndex = targetListIndex;
      setIsMoving(false);
    },
    [index, listIndex, moveCard, setIsMoving]
  );

  const [, dropRef] = useDrop({
    accept: [DRAG_TYPE],
    hover: handleHover,
  });

  dragRef(dropRef(ref));

  return {
    ref,
    isDragging,
  };
};
