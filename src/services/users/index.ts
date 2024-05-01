import { AxiosResponse } from "axios";

import { api } from "../api";

export type GetUserOutputError = { response: AxiosResponse };
export type GetUserOutput = {
  id: string;
};

export const getUser = async (): Promise<GetUserOutput> => {
  const output = await api.get("/users");

  return output.data?.user;
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
