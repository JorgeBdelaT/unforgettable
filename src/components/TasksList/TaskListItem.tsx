import { FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

import { Task } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

import { DATE_TIME_FORMAT, GET_ALL_TASKS_QUERY_KEY } from "../../constants";
import moment from "moment";

interface TaskListItemProps {
  task: Task;
}

const TaskListItem: FC<TaskListItemProps> = ({ task }) => {
  const queryClient = useQueryClient();

  const {
    mutate: toggleTaskStatusMutation,
    isLoading: toggleTaskStatusLoading,
  } = trpc.tasks.toggleCompletedState.useMutation({
    onMutate: async ({ taskId: toggledTaskId }) => {
      const previousTasks = queryClient.getQueryData<Task[]>(
        GET_ALL_TASKS_QUERY_KEY
      );

      queryClient.setQueryData(
        GET_ALL_TASKS_QUERY_KEY,
        (old: Task[] | undefined) => {
          if (!old) return [];
          return old.map((task) =>
            task.id === toggledTaskId
              ? { ...task, completed: !task.completed }
              : task
          );
        }
      );

      return { previousTasks };
    },
    onError: (err, _, context) => {
      // TODO: do something better with the error
      window.alert(
        `No se pudo cambiar el estado de la tarea :( ${err.message}`
      );

      queryClient.setQueryData(GET_ALL_TASKS_QUERY_KEY, context?.previousTasks);
    },
  });

  const { mutate: deleteTaskMutation, isLoading: deleteTaskMutationLoading } =
    trpc.tasks.delete.useMutation({
      onMutate: async ({ taskId: deletedTaskId }) => {
        const previousTasks = queryClient.getQueryData<Task[]>(
          GET_ALL_TASKS_QUERY_KEY
        );

        queryClient.setQueryData(
          GET_ALL_TASKS_QUERY_KEY,
          (old: Task[] | undefined) => {
            if (!old) return [];
            return old.filter(({ id }) => id !== deletedTaskId);
          }
        );

        return { previousTasks };
      },
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo eliminar la tarea :( ${err.message}`);

        queryClient.setQueryData(
          GET_ALL_TASKS_QUERY_KEY,
          context?.previousTasks
        );
      },
    });

  const handleDelete = () => {
    if (!deleteTaskMutationLoading) deleteTaskMutation({ taskId: task.id });
  };

  const handleToggleTaskStatus = () => {
    if (!toggleTaskStatusLoading) toggleTaskStatusMutation({ taskId: task.id });
  };

  const dateTimeToDisplay = moment(task.createdAt).format(DATE_TIME_FORMAT);

  const { completed } = task;

  return (
    <li
      className={`relative mb-4 flex flex-col rounded-lg bg-slate-800 py-2 px-4 pr-6 shadow-md transition-colors last:mb-0 ${
        completed ? "bg-opacity-70" : "hover:bg-opacity-90"
      }`}
    >
      <div className="container mt-1 flex items-start gap-4">
        <input
          onChange={handleToggleTaskStatus}
          value={`${completed}`}
          checked={completed}
          type="checkbox"
          className="relative flex h-6 w-6 flex-shrink-0 cursor-pointer appearance-none items-center justify-center rounded-xl bg-indigo-200  checked:before:block checked:before:h-4 checked:before:w-4 checked:before:rounded-full checked:before:bg-indigo-400"
        />
        <p
          className={`${
            completed ? "text-gray-400 line-through" : ""
          } decoration-indigo-400 decoration-2`}
        >
          {task.text}
        </p>
      </div>
      <span className="self-end text-xs font-light text-gray-300">
        {dateTimeToDisplay}
      </span>
      <button
        onClick={handleDelete}
        className="absolute top-0 right-0 flex h-8 w-8 justify-end"
      >
        <XMarkIcon className="m-2 h-4 w-4 text-gray-500" />
      </button>
    </li>
  );
};

export default TaskListItem;
