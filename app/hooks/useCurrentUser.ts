import { User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Action = {
  setUser: (user: User | null | undefined) => void;
  deleteUser: () => void;
};

type State = {
  user: User | null | undefined;
  isUser: boolean;
};

const useCurrentUser = create<Action & State>()(
  persist(
    (set) => ({
      user: undefined,
      isUser: false,
      setUser: (user) => {
        set({
          user,
          isUser: !!user,
        });
      },
      deleteUser: () => {
        set({
          user: null,
          isUser: false,
        });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useCurrentUser;
