import React, { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Task } from "@prisma/client";
import { trpc } from "../../utils/trpc";

import { GET_ALL_TASKS_QUERY_KEY, TASKS_LIST_ID } from "../../constants";
import BottomForm from "../BottomForm";

const CreateTask = () => {
  // TODO: use react hook form
  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createTask, isLoading: createTaskLoading } =
    trpc.tasks.create.useMutation({
      onMutate: async ({ text }) => {
        // scroll to top of the list
        const tasksListElement = document.getElementById(TASKS_LIST_ID);
        tasksListElement?.scrollTo({ top: 0, behavior: "smooth" });

        setText("");

        await queryClient.cancelQueries(GET_ALL_TASKS_QUERY_KEY);
        const previousTasks = queryClient.getQueryData(GET_ALL_TASKS_QUERY_KEY);

        queryClient.setQueryData(
          GET_ALL_TASKS_QUERY_KEY,
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

        queryClient.setQueryData(
          GET_ALL_TASKS_QUERY_KEY,
          context?.previousTasks
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(GET_ALL_TASKS_QUERY_KEY);
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createTask({ text });
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
