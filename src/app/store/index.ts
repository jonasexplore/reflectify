import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";

type LikeProps = {
  id: string;
  userId: string;
  timestamp: string;
};

type CommentProps = {
  id: string;
  userId: string;
  timesteamp: string;
  likes: LikeProps[];
  content: string;
};

export type CardProps = {
  id: string;
  content: string;
  likes: LikeProps[];
  comments: CommentProps[];
};

type ContainerProps = {
  id: string;
  name: string;
  color: string;
};

type StoreProps = {
  cards: CardProps[];
  setCards: (values: CardProps[]) => void;
  containers: ContainerProps[];
  setContainers: (values: ContainerProps[]) => void;
  items: Record<string, UniqueIdentifier[]>;
  setItems: (values: Record<string, UniqueIdentifier[]>) => void;
};

export const useStoreBoard = create<StoreProps>((set) => ({
  cards: [],
  setCards: (value) =>
    set({
      cards: value,
    }),
  containers: [],
  setContainers: (value) =>
    set({
      containers: value,
    }),
  items: {},
  setItems: (value) =>
    set({
      items: value,
    }),
}));
