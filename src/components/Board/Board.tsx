import { useMemo, useState } from "react";
import { BoardContext } from "./BoardContext";
import { BoardList } from "./components/BoardList";
import { useBoard } from "./hooks/useBoard";

export const Board = () => {
  const [isMoving, setIsMoving] = useState(false);
  const { lists, moveCard, deleteCard } = useBoard();

  const value = useMemo(
    () => ({ lists, moveCard, deleteCard, isMoving, setIsMoving }),
    [lists, moveCard, deleteCard, isMoving, setIsMoving]
  );

  return (
    <BoardContext.Provider value={value}>
      <ul className="flex gap-4">
        {lists.map((list, index) => (
          <li key={list.id} className="w-full">
            <BoardList
              cards={list.cards}
              title={list.title}
              listIndex={index}
            />
          </li>
        ))}
      </ul>
    </BoardContext.Provider>
  );
};
