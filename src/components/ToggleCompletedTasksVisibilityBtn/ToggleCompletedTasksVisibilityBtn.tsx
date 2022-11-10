import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import useSettingsStore from "../../stores/SettingsStore";

const ToggleCompletedTasksVisibilityBtn = () => {
  const { displayCompletedTasks, toggleDisplayCompletedTasks } =
    useSettingsStore();

  const [iconToDisplay, setIconToDisplay] = useState<JSX.Element>();

  useEffect(() => {
    setIconToDisplay(
      displayCompletedTasks ? (
        <EyeIcon className="h-6 w-6" />
      ) : (
        <EyeSlashIcon className="h-6 w-6" />
      )
    );
  }, [displayCompletedTasks]);
  return (
    <button
      onClick={toggleDisplayCompletedTasks}
      className="rounded-md bg-indigo-200 p-2 text-slate-800 opacity-90 hover:bg-indigo-300 disabled:pointer-events-none disabled:text-slate-500"
    >
      {iconToDisplay}
    </button>
  );
};

export default React.memo(ToggleCompletedTasksVisibilityBtn);
