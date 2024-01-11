import { create } from "zustand";

type UserProps = {
  id: string;
  email: string;
  fullName: string;
  accessToken: string;
  profileImage: string;
};

type AuthProps = {
  user?: Partial<UserProps>;
  setUser: (values: Partial<UserProps>) => void;
};

export const useStoreAuth = create<AuthProps>((set) => ({
  user: undefined,
  setUser: (value) =>
    set((state) => {
      return { user: { ...state.user, ...value } };
    }),
}));
