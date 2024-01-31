import { api } from "../api";

export const getUser = async (email: string) => {
  try {
    const output = await api.get("/users", { params: { email } });

    return output.data?.user;
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (email: string) => {
  try {
    const output = await api.post("/users", {
      email,
    });

    return output.data;
  } catch (error) {
    console.log(error);
  }
};
