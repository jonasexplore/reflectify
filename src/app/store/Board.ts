import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";

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
};

export const useStoreBoard = create<StoreProps>((set) => ({
  cards: [],
  setCards: (value) => set({ cards: value }),
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
}));
