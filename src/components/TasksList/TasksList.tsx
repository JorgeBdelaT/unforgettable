import {
  ExclamationTriangleIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import { useIsMutating } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  HEADER_HEIGHT,
  BOTTOM_FORM_HEIGHT,
  TASKS_LIST_ID,
  UNDO_LAST_TASK_REMOVAL_MUTATION_KEY,
} from "../../constants";
import useSelectedListStore from "../../stores/SelectedListStore";
import useSettingsStore from "../../stores/SettingsStore";

import { trpc } from "../../utils/trpc";

import TaskListItem from "./TaskListItem";
import TasksListSkeleton from "./TasksListSkeleton";

const TasksList = () => {
  const displayCompletedTasks = useSettingsStore(
    (state) => state.displayCompletedTasks
  );

  const selectedList = useSelectedListStore((state) => state.selectedList);

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = trpc.tasks.getAll.useQuery(
    { listId: selectedList?.id },
    { enabled: !!selectedList }
  );

  const isMutatingUndoLastRemoval = useIsMutating({
    mutationKey: UNDO_LAST_TASK_REMOVAL_MUTATION_KEY,
  });

  const tasksToDisplay = useMemo(() => {
    if (!tasks) return [];
    if (displayCompletedTasks) return tasks;

    return tasks.filter(({ completed }) => completed === false);
  }, [displayCompletedTasks, tasks]);

  if (tasksLoading || isMutatingUndoLastRemoval) return <TasksListSkeleton />;

  if (tasksError)
    return (
      <div
        className="flex flex-col items-center justify-center gap-6 overflow-y-auto text-slate-500"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
        }}
      >
        <ExclamationTriangleIcon className="h-24 w-24" />
        <p className="text-xl font-medium">Ups! Algo no anda bien.</p>
      </div>
    );

  const hasNoData = !tasksToDisplay?.length && !tasksLoading;

  if (hasNoData)
    return (
      <div
        className="flex flex-col items-center justify-center gap-6 overflow-y-auto text-slate-500"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
        }}
      >
        <NewspaperIcon className="h-24 w-24" />
        <p className="text-xl font-medium">Nada por hacer a??n!</p>
      </div>
    );

  return (
    <ul
      id={TASKS_LIST_ID}
      className="overflow-y-auto px-4 pt-16"
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
      }}
    >
      {tasksToDisplay?.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
};

export default TasksList;
