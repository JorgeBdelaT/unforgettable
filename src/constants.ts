export const BOTTOM_FORM_HEIGHT = "5rem";
export const DATE_TIME_FORMAT = "HH:mm DD.MM";
export const DEFAULT_LIST_NAME = "No olvidar!";
export const GET_ALL_TASKS_QUERY_KEY = (listId?: string | null | undefined) => [
  ["tasks", "getAll"],
  { listId },
];
export const GET_ALL_LISTS_QUERY_KEY = [["lists", "getAll"]];
export const HEADER_HEIGHT = "3rem";
export const ROUTES = {
  auth: "/auth",
  lists: "/lists",
  tasks: "/",
};
export const TASKS_LIST_ID = "tasks-list";
export const LIST_GRID_ID = "lists-grid";
export const TIME_FORMAT = "HH:mm";
export const UNDO_LAST_TASK_REMOVAL_MUTATION_KEY = ["undoLastTaskRemoval"];
