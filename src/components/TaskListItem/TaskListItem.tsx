import { FC } from "react";
import { Task } from "@prisma/client";

interface TaskListItemProps {
  task: Task;
}

const TaskListItem: FC<TaskListItemProps> = ({ task }) => <li>{task.text}</li>;

export default TaskListItem;
