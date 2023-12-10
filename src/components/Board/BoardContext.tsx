import { createContext } from "react";

type BoardContextProps = {
  lists: Array<{
    id: string;
    title: string;
    cards: Array<{
      id: string;
      text: string;
    }>;
  }>;
  move: (fromList: number, toList: number, from: number, to: number) => void;
};
export const BoardContext = createContext({} as BoardContextProps);
