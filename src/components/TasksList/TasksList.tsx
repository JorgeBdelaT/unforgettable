import {
  HEADER_HEIGHT,
  CREATE_TASK_FORM_HEIGHT,
  TASKS_LIST_ID,
} from "../../constants";

import { trpc } from "../../utils/trpc";

import TaskListItem from "./TaskListItem";
import TasksListSkeleton from "./TasksListSkeleton";

const TasksList = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = trpc.tasks.getAll.useQuery();

  if (tasksLoading) return <TasksListSkeleton />;

  if (tasksError)
    return (
      <div>
        Ups! Something happend
        <br /> TODO: implement error component
      </div>
    );

  const hasNoData = !tasks?.length && !tasksLoading;

  if (hasNoData)
    return (
      <div>
        No tasks to display
        <br /> TODO: implement empty list component
      </div>
    );

  return (
    <ul
      id={TASKS_LIST_ID}
      className="overflow-y-auto px-8 pt-16"
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT} - ${CREATE_TASK_FORM_HEIGHT})`,
      }}
    >
      {tasks?.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
};

export default TasksList;
