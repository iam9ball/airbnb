import { create } from "zustand";
import { persist } from "zustand/middleware";

type Action = {
  setUser: (user: string  ) => void;
  deleteUser: () => void;
};

type State = {
  user: string ;
  isUser: boolean;
};

const useUnverifiedUser = create<Action & State>()(
  persist(
    (set) => ({
      user: "",
      isUser: false,
      setUser: (user) => {
        set({
          user,
          isUser: !!user,
        });
      },
      deleteUser: () => {
        set({
          user: "",
          isUser: false,
        });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUnverifiedUser;
