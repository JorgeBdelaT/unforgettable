import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SettingsState {
  displayCompletedTasks: boolean;
  toggleDisplayCompletedTasks: () => void;
}

const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        displayCompletedTasks: true,
        toggleDisplayCompletedTasks: () =>
          set((state) => ({
            displayCompletedTasks: !state.displayCompletedTasks,
          })),
      }),
      {
        name: "settings-storage",
      }
    )
  )
);

export default useSettingsStore;
