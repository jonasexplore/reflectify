import { UniqueIdentifier } from "@dnd-kit/core";

import { BoardProps } from "@/types/board";

import { api } from "../api";

type fetchBoardOutput = {
  boards: Array<{
    id: string;
    name: string;
    created: Date;
    updated: Date;
    isPublic: boolean;
    userId: string;
  }>;
};

export const fetchBoard = async () => {
  try {
    const output = await api.get<fetchBoardOutput>("/boards");

    return output.data?.boards;
  } catch (error) {
    return [];
  }
};

export const getBoard = async (
  boardId: string
): Promise<BoardProps | undefined> => {
  const output = await api.get(`/boards/${boardId}`);

  return output.data;
};

type CreateBoardInput = { name: string; isPublic: boolean };
type CreateBoardOutput = {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  userId: string;
};
export const createBoard = async ({
  name,
  isPublic,
}: CreateBoardInput): Promise<CreateBoardOutput> => {
  const output = await api.post("/boards", {
    name,
    isPublic,
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

type UpdateBoardInput = {
  boardId: string;
  input: UpdateBoardProps;
};

export const updateBoard = async ({ boardId, input }: UpdateBoardInput) => {
  try {
    const output = await api.put(`/boards/${boardId}`, input);

    return output.data;
  } catch (error) {
    return {};
  }
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  try {
    const output = await api.delete(`/boards/${boardId}`);

    return output.data;
  } catch (error) {}
};
