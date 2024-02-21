import { UniqueIdentifier } from "@dnd-kit/core";

import { api } from "../api";

export const fetchBoard = async (userId: string) => {
  try {
    const output = await api.get("/boards", { params: { userId } });

    return output.data?.boards;
  } catch (error) {
    return [];
  }
};

export type GetBoardOutput = {
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

export const getBoard = async (
  boardId: string
): Promise<GetBoardOutput | undefined> => {
  try {
    const output = await api.get(`/boards/${boardId}`);

    return output.data;
  } catch (error) {
    console.log(error);
  }
};

export const createBoard = async (name: string, userId: string) => {
  const output = await api.post("/boards", {
    name,
    userId,
  });

  return output.data;
};

type UpdateBoardProps = {
  cards: Array<{
    id: UniqueIdentifier;
    userId: string;
    columnId: UniqueIdentifier;
    content: string;
  }>;
  columns: Array<{
    id: string;
    name: string;
    position: number;
  }>;
};

export const updateBoard = async (boardId: string, input: UpdateBoardProps) => {
  try {
    const output = await api.put(`/boards/${boardId}`, input);

    return output.data;
  } catch (error) {
    return {};
  }
};
