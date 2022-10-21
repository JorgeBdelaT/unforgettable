import { trpc } from "../../utils/trpc";
import TaskListItem from "../TaskListItem";

const DailyTasksList = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = trpc.tasks.getAllFromToday.useQuery();

  if (tasksLoading)
    return (
      <div>
        No tasks to loading
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
    <ul>
      {tasks?.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
};

export default DailyTasksList;
