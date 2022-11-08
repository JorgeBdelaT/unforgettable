import { trpc } from "../../utils/trpc";
import TaskListItem from "../TaskListItem";

const TasksList = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = trpc.tasks.getAll.useQuery();

  if (tasksLoading)
    return (
      <div>
        loading...
        <br /> TODO: implement skeleton
      </div>
    );

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
    <ul className="overflow-auto">
      {tasks?.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
};

export default TasksList;
