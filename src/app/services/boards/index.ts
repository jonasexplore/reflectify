import { api } from "../api";

export const fetchBoard = async (userId: string) => {
  try {
    const output = await api.get("/boards", { params: { userId } });

    return output.data?.boards;
  } catch (error) {
    return [];
  }
};

export const getBoard = async (boardId: string) => {
  try {
    const output = await api.get(`/boards/${boardId}`);

    return output.data;
  } catch (error) {
    return {};
  }
};

export const createBoard = async (name: string, userId: string) => {
  try {
    const output = await api.post("/boards", {
      name,
      userId,
    });

    return output.data;
  } catch (error) {
    return {};
  }
};
