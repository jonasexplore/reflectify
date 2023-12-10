import { useMemo } from "react";
import { BoardContext } from "./BoardContext";
import { BoardList } from "./components/BoardList";
import { useBoard } from "./hooks/useBoard";

export const Board = () => {
  const { lists, move } = useBoard();
  const value = useMemo(() => ({ lists, move }), [lists, move]);

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
