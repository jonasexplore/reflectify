import { api } from "../api";

type GetUserOutput = {
  id: string;
};

export const getUser = async (
  email: string
): Promise<GetUserOutput | undefined> => {
  try {
    const output = await api.get("/users", { params: { email } });

    return output.data?.user;
  } catch (error) {
    console.log(error);
  }
};

type CreateUserOutput = {
  id: string;
};

export const createUser = async (
  email: string
): Promise<CreateUserOutput | undefined> => {
  try {
    const output = await api.post("/users", {
      email,
    });

    return output.data;
  } catch (error) {
    console.log(error);
  }
};
