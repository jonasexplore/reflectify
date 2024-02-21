import { create } from "zustand";

type UserProps = {
  id: string;
};

type AuthProps = {
  user: UserProps | undefined;
  setUser: (id: string) => void;
};

export const useStoreAuth = create<AuthProps>((set) => ({
  user: undefined,
  setUser: (id) => set({ user: { id } }),
}));
