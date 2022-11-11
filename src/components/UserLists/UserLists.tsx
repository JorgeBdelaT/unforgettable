import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

import { HEADER_HEIGHT, CREATE_TASK_FORM_HEIGHT } from "../../constants";

import { trpc } from "../../utils/trpc";
import UserListsItem from "./UserListsItem";

// import TaskListItem from "./TaskListItem";
// import TasksListSkeleton from "./TasksListSkeleton";

const UserLists = () => {
  // const displayCompletedTasks = useSettingsStore(
  //   (state) => state.displayCompletedTasks
  // );

  const {
    data: lists,
    isLoading: listsLoading,
    isError: listsError,
  } = trpc.lists.getAll.useQuery();

  if (listsLoading) return <>loading...</>;

  if (listsError)
    return (
      <div
        className="flex flex-col items-center justify-center gap-6 overflow-y-auto text-slate-500"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT} - ${CREATE_TASK_FORM_HEIGHT})`,
        }}
      >
        <ExclamationTriangleIcon className="h-24 w-24" />
        <p className="text-xl font-medium">Ups! Algo no anda bien.</p>
      </div>
    );

  return (
    <div
      style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT} - ${CREATE_TASK_FORM_HEIGHT})`,
      }}
    >
      <div
        // id={TASKS_LIST_ID}
        className="grid h-full grid-cols-2 items-start gap-3 overflow-y-auto px-4 pt-16 lg:grid-cols-3"
      >
        {lists?.map((list) => (
          <UserListsItem key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default UserLists;
