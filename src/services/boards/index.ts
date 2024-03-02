import { UniqueIdentifier } from "@dnd-kit/core";

import { BoardProps } from "@/store";

import { api } from "../api";

export const fetchBoard = async (userId: string) => {
  try {
    const output = await api.get("/boards", { params: { userId } });

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

type CreateBoardInput = { name: string; userId: string };
type CreateBoardOutput = {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  userId: string;
};
export const createBoard = async ({
  name,
  userId,
}: CreateBoardInput): Promise<CreateBoardOutput> => {
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
