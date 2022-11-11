import React, { useState } from "react";
import { useRouter } from "next/router";
import { XMarkIcon } from "@heroicons/react/24/solid";

import moment from "moment";
import { List, Task } from "@prisma/client";

import {
  DATE_TIME_FORMAT,
  GET_ALL_LISTS_QUERY_KEY,
  ROUTES,
} from "../../constants";

import useSelectedListStore from "../../stores/SelectedListStore";
import { trpc } from "../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

interface ListsGridItemProps {
  deleteEnabled: boolean;
  list: List & {
    tasks: Task[];
    _count: {
      users: number;
    };
  };
}

const ListsGridItem: React.FC<ListsGridItemProps> = ({
  deleteEnabled,
  list,
}) => {
  const [routerLoading, setRouterLoading] = useState(false);

  const router = useRouter();

  const setSelectedList = useSelectedListStore(
    (state) => state.setSelectedList
  );

  const queryClient = useQueryClient();

  const { mutate: deleteListMutation, isLoading: deleteListMutationLoading } =
    trpc.lists.delete.useMutation({
      onMutate: async ({ listId: deletedListId }) => {
        const previousTasks = queryClient.getQueryData<List[]>(
          GET_ALL_LISTS_QUERY_KEY
        );

        queryClient.setQueryData(
          GET_ALL_LISTS_QUERY_KEY,
          (old: List[] | undefined) => {
            if (!old) return [];
            return old.filter(({ id }) => id !== deletedListId);
          }
        );

        return { previousTasks };
      },
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo eliminar la lista :( ${err.message}`);

        queryClient.setQueryData(
          GET_ALL_LISTS_QUERY_KEY,
          context?.previousTasks
        );
      },
    });

  const handleClick = () => {
    setRouterLoading(true);
    if (!routerLoading) {
      setSelectedList(list);
      router.push(ROUTES.tasks);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (!deleteListMutationLoading && deleteEnabled)
      deleteListMutation({ listId: list.id });
  };

  const createdAt = moment(list.createdAt).format(DATE_TIME_FORMAT);
  const completedTasksOnLast24h = list.tasks.filter(
    ({ completed }) => completed
  ).length;
  const totalTasks = list.tasks.length;
  const otherUsersCount = list._count.users - 1;

  return (
    <div
      onClick={handleClick}
      className={`relative flex cursor-pointer flex-col items-start gap-2 rounded-lg bg-slate-800 px-4 pt-3 pb-8 pr-7 shadow-md transition-colors hover:bg-opacity-90`}
    >
      <p className="text-xl font-light">{list.name}</p>
      <p className="text-sm font-light text-slate-400">
        {otherUsersCount > 0 ? `Tú y ${otherUsersCount} más` : "Privado"}
      </p>
      <p className="text-md text-slate-200">
        {totalTasks > 0
          ? `${completedTasksOnLast24h} tarea(s) completadas de ${totalTasks}`
          : "Nada por hacer"}
      </p>
      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs font-light">
        <span className=" text-slate-600">{createdAt}</span>
      </div>
      {deleteEnabled && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 flex h-8 w-8 justify-end"
        >
          <XMarkIcon className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default ListsGridItem;
