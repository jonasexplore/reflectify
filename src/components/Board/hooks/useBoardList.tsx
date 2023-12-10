"use client";
import { BoardContext } from "@/components/Board/BoardContext";
import { useContext, useRef } from "react";
import { useDrop } from "react-dnd";

type Props = {
  listIndex: number;
};

export const useBoardList = ({ listIndex }: Props) => {
  const DRAG_TYPE = "CARD";

  const { lists, move } = useContext(BoardContext);

  const ref = useRef<HTMLLIElement>(null);

  const [, dropRef] = useDrop({
    accept: [DRAG_TYPE],
    hover: (
      item: {
        listIndex: number;
      },
      monitor
    ) => {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      if (
        draggedListIndex === targetListIndex ||
        lists[targetListIndex].cards.length > 0
      ) {
        return;
      }

      const draggedIndex = monitor.getItem().listIndex;
      const targetIndex = 0;

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      item.listIndex = targetListIndex;
    },
  });

  dropRef(ref);

  return {
    ref,
  };
};
