import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VerificationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useVerificationModal = create<VerificationModalStore>()(
  persist(
    (set) => ({
      isOpen: false,
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useVerificationModal;
