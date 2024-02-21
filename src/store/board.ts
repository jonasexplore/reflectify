import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";

export type BoardProps = {
  id: string;
  name: string;
  created: string;
  updated: string;
  userId: string;
  columns: Array<{
    id: string;
    name: string;
    position: number;
    boardId: string;
    cards: Array<{
      id: string;
      content: string;
      userId: string;
      boardId: string;
      columnId: string;
      likes: any[];
      comments: any[];
    }>;
  }>;
};

type LikeProps = {
  id: string;
  userId: string;
  timestamp: string;
};

export type CommentProps = {
  id: string;
  userId: string;
  timesteamp: string;
  likes: LikeProps[];
  content: string;
};

export type CardProps = {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  content: string;
  likes: LikeProps[];
  comments: CommentProps[];
};

export type ContainerProps = {
  id: string;
  name: string;
  color: string;
};

export type ItemsProps = Record<string, UniqueIdentifier[]>;

type StoreProps = {
  cards: CardProps[];
  fillBoard: (values: BoardProps) => void;
  setCards: (values: CardProps[]) => void;
  addCard: (containerId: UniqueIdentifier, card: CardProps) => void;
  removeCard: (containerId: UniqueIdentifier, cardId: UniqueIdentifier) => void;
  containers: ContainerProps[];
  setContainers: (values: ContainerProps[]) => void;
  removeContainer: (containerId: UniqueIdentifier) => void;
  items: ItemsProps;
  setItems: (values: ItemsProps) => void;
  containersIds: UniqueIdentifier[];
  setContainersIds: (values: UniqueIdentifier[]) => void;
  reset: () => void;
};

export const useStoreBoard = create<StoreProps>((set) => ({
  cards: [],
  setCards: (value) => set({ cards: value }),
  fillBoard: (value) =>
    set((state) => {
      const containersIds = value.columns.map((column: any) => column.id);
      const cards = value.columns.reduce(
        (acc: any, curr: any) => acc.concat(curr.cards),
        []
      );
      const containers = [
        ...state.containers,
        ...value.columns.map((column: any) => ({
          color: "red",
          id: column.id,
          name: column.name,
        })),
      ];
      const items = Object.assign(
        state.items,
        value.columns.reduce(
          (acc: any, curr: any) =>
            Object.assign(acc, {
              [curr.id]: curr.cards.map((card: any) => card.id),
            }),
          {}
        )
      );

      return {
        items,
        cards,
        containers,
        containersIds,
      };
    }),
  addCard: (containerId, card) => {
    set((state) => {
      const items = state.items;

      return {
        cards: [...state.cards, card],
        items: { ...items, [containerId]: [...items[containerId], card.id] },
      };
    });
  },
  removeCard: (containerId, cardId) =>
    set((state) => {
      const items = state.items;

      return {
        cards: state.cards.filter((card) => card.id !== cardId),
        items: {
          ...items,
          [containerId]: items[containerId].filter((id) => id !== cardId),
        },
      };
    }),
  containers: [],
  setContainers: (value) => set({ containers: value }),
  items: {},
  setItems: (value) => set({ items: value }),
  containersIds: [],
  setContainersIds: (value) => set({ containersIds: value }),
  removeContainer: (containerId) =>
    set((state) => {
      const items = state.items;
      delete items[containerId];

      return {
        items,
        containers: state.containers.filter((item) => item.id !== containerId),
        containersIds: state.containersIds.filter((id) => id !== containerId),
      };
    }),
  reset: () =>
    set({
      items: {},
      cards: [],
      containers: [],
      containersIds: [],
    }),
}));
