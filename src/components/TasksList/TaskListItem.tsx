import { FC } from "react";
import { Task } from "@prisma/client";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { trpc } from "../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { GET_ALL_TASKS_QUERY_KEY } from "../CreateTask/CreateTask";

interface TaskListItemProps {
  task: Task;
}

const TaskListItem: FC<TaskListItemProps> = ({ task }) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = trpc.tasks.delete.useMutation({
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

      queryClient.setQueryData(GET_ALL_TASKS_QUERY_KEY, context?.previousTasks);
    },
  });

  const handleDelete = () => {
    if (!isLoading) mutate({ taskId: task.id });
  };

  return (
    <li className="relative mb-4 rounded-lg bg-slate-800 py-2 px-4 shadow-md transition-colors last:mb-0 hover:bg-opacity-90">
      {task.text}
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
