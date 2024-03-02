import { create } from "zustand";

type UserProps = {
  id: string;
};

type AuthProps = {
  user: UserProps | null;
  setUser: (id: string) => void;
};

export const useStoreAuth = create<AuthProps>((set) => ({
  user: null,
  setUser: (id) => set({ user: { id } }),
}));
