import { List, Task } from "@prisma/client";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ListWithTasksAndUsersCount = List & {
  tasks: Task[];
  _count: {
    users: number;
  };
};

interface SelectedListState {
  selectedList?: ListWithTasksAndUsersCount;
  setSelectedList: (list?: ListWithTasksAndUsersCount) => void;
}

const useSelectedListStore = create<SelectedListState>()(
  devtools(
    persist(
      (set) => ({
        selectedList: undefined,
        setSelectedList: (list?: ListWithTasksAndUsersCount) =>
          set({ selectedList: list }),
      }),
      {
        name: "selected-list-storage",
      }
    )
  )
);

export default useSelectedListStore;
