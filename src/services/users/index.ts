import { api } from "../api";

type GetUserOutput = {
  id: string;
};

export const getUser = async (): Promise<GetUserOutput | undefined> => {
  try {
    const output = await api.get("/api/users");

    return output.data?.user;
  } catch (error) {
    console.log(error);
  }
};

type CreateUserOutput = {
  id: string;
};

export const createUser = async (): Promise<CreateUserOutput | undefined> => {
  try {
    const output = await api.post("/api/users");

    return output.data;
  } catch (error) {
    console.log(error);
  }
};
