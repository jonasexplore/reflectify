import { UniqueIdentifier } from "@dnd-kit/core";
import { Socket } from "socket.io-client";
import { create } from "zustand";

import { BoardProps, CardProps } from "@/types/board";

export type ContainerProps = {
  id: string;
  name: string;
  color: string;
};

export type ItemsProps = Record<string, UniqueIdentifier[]>;

type StoreProps = {
  set: (
    partial:
      | StoreProps
      | Partial<StoreProps>
      | ((state: StoreProps) => StoreProps | Partial<StoreProps>),
    replace?: boolean | undefined
  ) => void;
  socket: Socket | null;
  board: Pick<BoardProps, "id" | "name" | "userId">;
  items: ItemsProps;
  cards: CardProps[];
  containers: ContainerProps[];
  containersIds: UniqueIdentifier[];
  hideCards: boolean;
};

export const useStoreBoard = create<StoreProps>((set) => ({
  set,
  socket: null,
  board: { id: "", name: "", userId: "" },
  items: {},
  cards: [],
  containers: [],
  containersIds: [],
  hideCards: false,
}));
