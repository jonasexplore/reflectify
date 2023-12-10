import React from "react";
import { clsx } from "clsx";

import { CardFooter } from "./components/CardFooter";
import { useCard } from "./hooks/useCard";

type Props = {
  children: React.ReactNode;
  index: number;
  listIndex: number;
};

export const Card = ({ children, index, listIndex }: Props) => {
  const { ref, isDragging } = useCard({ index, listIndex });

  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-md p-2 flex flex-col gap-2",
        isDragging
          ? "bg-transparent border border-dashed border-gray-400 cursor-grabbing"
          : "bg-gray-600"
      )}
    >
      <div className={clsx(isDragging ? "invisible" : "")}>
        <div>{children}</div>
        <CardFooter />
      </div>
    </div>
  );
};
