import { FC } from "react";
import { Task } from "@prisma/client";

interface TaskListItemProps {
  task: Task;
}

const TaskListItem: FC<TaskListItemProps> = ({ task }) => (
  <li className="mb-4 rounded-lg bg-slate-800 py-2 px-4 shadow-md transition-colors last:mb-0 hover:bg-opacity-90">
    {task.text}
  </li>
);

export default TaskListItem;
