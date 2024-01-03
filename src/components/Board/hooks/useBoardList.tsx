"use client";
import { BoardContext } from "@/components/Board/BoardContext";
import { useCallback, useContext, useMemo, useRef } from "react";
import { useDrop } from "react-dnd";

type Props = {
  listIndex: number;
};

export const useBoardList = ({ listIndex }: Props) => {
  const DRAG_TYPE = "CARD";

  const { lists, moveCard, isMoving, setIsMoving } = useContext(BoardContext);

  const ref = useRef<HTMLDivElement>(null);

  const targetListLength: number = useMemo(
    () => lists[listIndex].cards.length,
    [listIndex, lists]
  );

  const handleHover = useCallback(
    (item: { index: number; listIndex: number }) => {
      if (isMoving && targetListLength) {
        return;
      }

      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      if (draggedListIndex === targetListIndex) {
        return;
      }

      const draggedIndex = item.index;
      const targetIndex = targetListLength;

      moveCard(
        draggedListIndex,
        targetListIndex,
        draggedIndex,
        targetIndex,
        "list"
      );
      setIsMoving(false);
      item.index = targetIndex;
      item.listIndex = targetListIndex;
    },
    [isMoving, listIndex, moveCard, setIsMoving, targetListLength]
  );

  const [, dropRef] = useDrop({
    accept: [DRAG_TYPE],
    hover: handleHover,
  });

  dropRef(ref);

  return {
    ref,
  };
};
