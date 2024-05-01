import { api } from "../api";

type GetUserOutput = {
  id: string;
};

export const getUser = async (): Promise<GetUserOutput | undefined> => {
  try {
    const output = await api.get("/users");

    return output.data?.user;
  } catch (error) {}
};

type CreateUserOutput = {
  id: string;
};

export const createUser = async (): Promise<CreateUserOutput | undefined> => {
  try {
    const output = await api.post("/users");

    return output.data;
  } catch (error) {}
};
