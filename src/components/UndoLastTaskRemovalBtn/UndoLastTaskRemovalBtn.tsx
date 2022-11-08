import React from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

import {
  GET_ALL_TASKS_QUERY_KEY,
  UNDO_LAST_TASK_REMOVAL_MUTATION_KEY,
} from "../../constants";

import { trpc } from "../../utils/trpc";

const UndoLastTaskRemovalBtn = () => {
  const queryClient = useQueryClient();

  const { mutate: undoLastRemoval, isLoading: undoLastRemovalLoading } =
    trpc.tasks.undoLastRemoval.useMutation({
      mutationKey: UNDO_LAST_TASK_REMOVAL_MUTATION_KEY,
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo restaurar la tarea :(`);
      },
      onSettled: () => {
        queryClient.invalidateQueries(GET_ALL_TASKS_QUERY_KEY);
      },
    });

  return (
    <button
      disabled={undoLastRemovalLoading}
      onClick={() => undoLastRemoval()}
      className="rounded-md bg-indigo-200 p-2 text-slate-800 opacity-90 disabled:pointer-events-none disabled:text-slate-500"
    >
      <ArrowUturnLeftIcon className="h-6 w-6" />
    </button>
  );
};

export default React.memo(UndoLastTaskRemovalBtn);
