import React, { useState, FormEvent, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Task } from "@prisma/client";
import { trpc } from "../../utils/trpc";

import { GET_ALL_TASKS_QUERY_KEY, TASKS_LIST_ID } from "../../constants";
import BottomForm from "../BottomForm";
import useSelectedListStore from "../../stores/SelectedListStore";

const CreateTask = () => {
  // TODO: use react hook form
  const [text, setText] = useState("");

  const selectedList = useSelectedListStore((state) => state.selectedList);

  const allTasksQueryKey = useMemo(
    () => GET_ALL_TASKS_QUERY_KEY(selectedList?.id),
    [selectedList?.id]
  );

  const queryClient = useQueryClient();

  const { mutate: createTask, isLoading: createTaskLoading } =
    trpc.tasks.create.useMutation({
      onMutate: async ({ text }) => {
        if (!selectedList) return;

        // scroll to top of the list
        const tasksListElement = document.getElementById(TASKS_LIST_ID);
        tasksListElement?.scrollTo({ top: 0, behavior: "smooth" });

        setText("");

        await queryClient.cancelQueries(allTasksQueryKey);
        const previousTasks = queryClient.getQueryData(allTasksQueryKey);

        queryClient.setQueryData(
          allTasksQueryKey,
          (old: Task[] | undefined) => {
            const optimisticTask: Task = {
              text,

              // TODO: fix this
              id: "new-task",
              priority: 99999999999999,
              deadline: null,
              completed: false,
              deletedAt: null,
              completedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
              listId: selectedList.id,
            };

            if (!old) return [optimisticTask];
            return [optimisticTask, ...old];
          }
        );

        return { previousTasks };
      },
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo crear la tarea :( ${err.message}`);

        queryClient.setQueryData(allTasksQueryKey, context?.previousTasks);
      },
      onSettled: () => {
        queryClient.invalidateQueries(allTasksQueryKey);
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedList) createTask({ text, listId: selectedList.id });
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) =>
    setText(e.currentTarget.value);

  return (
    <BottomForm
      inputName="text"
      loading={createTaskLoading}
      onInput={handleInput}
      onSubmit={handleSubmit}
      placeholder="Algo que hacer?"
      value={text}
    />
  );
};

export default React.memo(CreateTask);
