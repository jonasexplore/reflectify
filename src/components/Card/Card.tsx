import React, { useContext } from "react";
import { clsx } from "clsx";

import { CardFooter } from "./components/CardFooter";
import { useCard } from "./hooks/useCard";
import { BoardContext } from "../Board/BoardContext";

type Props = {
  children: React.ReactNode;
  index: number;
  listIndex: number;
};

export const Card = ({ children, index, listIndex }: Props) => {
  const { ref, isDragging } = useCard({ index, listIndex });
  const { deleteCard } = useContext(BoardContext);

  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-md p-2 flex flex-col gap-2 ",
        isDragging
          ? "bg-transparent border border-dashed border-gray-400 cursor-grabbing"
          : "bg-gray-600"
      )}
    >
      <div className={clsx(isDragging ? "invisible" : "")}>
        <div>{children}</div>
        <CardFooter onDelete={() => deleteCard(listIndex, index)} />
      </div>
    </div>
  );
};
