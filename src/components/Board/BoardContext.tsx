import { createContext } from "react";

type BoardContextProps = {
  isMoving: boolean;
  setIsMoving: (value: boolean) => void;
  lists: Array<{
    id: string;
    title: string;
    cards: Array<{
      id: string;
      text: string;
    }>;
  }>;
  moveCard: (
    fromList: number,
    toList: number,
    from: number,
    to: number,
    origin: string
  ) => void;
  deleteCard: (listIndex: number, cardIndex: number) => void;
};
export const BoardContext = createContext({} as BoardContextProps);
