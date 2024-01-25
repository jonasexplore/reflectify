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
