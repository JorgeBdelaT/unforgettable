import React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import useSettingsStore from "../../stores/SettingsStore";

const ToggleCompletedTasksVisibilityBtn = () => {
  const { displayCompletedTasks, toggleDisplayCompletedTasks } =
    useSettingsStore();

  return (
    <button
      onClick={toggleDisplayCompletedTasks}
      className="rounded-md bg-indigo-200 p-2 text-slate-800 opacity-90 hover:bg-indigo-300 disabled:pointer-events-none disabled:text-slate-500"
    >
      {displayCompletedTasks ? (
        <EyeIcon className="h-6 w-6" />
      ) : (
        <EyeSlashIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default React.memo(ToggleCompletedTasksVisibilityBtn);
