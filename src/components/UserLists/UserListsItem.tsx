import { FC, useState } from "react";
import { useRouter } from "next/router";
import { XMarkIcon } from "@heroicons/react/24/solid";

import moment from "moment";
import { List, Task } from "@prisma/client";

import { DATE_TIME_FORMAT, ROUTES } from "../../constants";

import useSelectedListStore from "../../stores/SelectedListStore";

interface UserListsItemProps {
  list: List & {
    tasks: Task[];
    _count: {
      users: number;
    };
  };
}

const UserListsItem: FC<UserListsItemProps> = ({ list }) => {
  const [routerLoading, setRouterLoading] = useState(false);

  const router = useRouter();

  const setSelectedList = useSelectedListStore(
    (state) => state.setSelectedList
  );

  const handleClick = () => {
    setRouterLoading(true);
    if (!routerLoading) {
      setSelectedList(list);
      router.push(ROUTES.tasks);
    }
  };

  const handleDelete = () => {
    // TODO: implement
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
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 flex h-8 w-8 justify-end"
      >
        <XMarkIcon className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export default UserListsItem;
