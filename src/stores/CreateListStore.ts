import { User } from "@prisma/client";
import create from "zustand";
import { devtools } from "zustand/middleware";

interface CreateListStoreState {
  name: string;
  setName: (listName: string) => void;
  sharedWith: User[];
  setSharedWith: (users: User[]) => void;
  removeSelectedUser: (id: string) => void;
}

const useCreateListStore = create<CreateListStoreState>()(
  devtools((set) => ({
    name: "",
    setName: (listName) => set({ name: listName }),
    sharedWith: [],
    setSharedWith: (users: User[]) => set({ sharedWith: users }),
    removeSelectedUser: (id: string) =>
      set((state) => ({
        sharedWith: state.sharedWith.filter((user) => user.id !== id),
      })),
  }))
);

export default useCreateListStore;
