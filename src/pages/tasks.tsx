import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@prisma/client";

const GET_ALL_FROM_TODAY_QUERY_KEY = [["tasks", "getAllFromToday"]];

const Tasks: NextPage = () => {
  // TODO: use react hook form
  const [text, setText] = useState("");
  const [deadlineStr, setDeadlineStr] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = trpc.tasks.getAllFromToday.useQuery();

  const {
    mutate: createTask,
    isLoading: createTaskLoading,
    isError: createTaskError,
  } = trpc.tasks.create.useMutation({
    onMutate: async ({ text, deadline }) => {
      await queryClient.cancelQueries(GET_ALL_FROM_TODAY_QUERY_KEY);

      const previousTasks = queryClient.getQueriesData([]);

      queryClient.setQueryData(
        GET_ALL_FROM_TODAY_QUERY_KEY,
        (old: Task[] | undefined) => {
          const optimisticTask: Task = {
            id: "new-task",
            text,
            deadline,
            priority: tasks ? tasks.length + 1 : 1,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          console.log({ old });

          if (!old) return [optimisticTask];
          return [optimisticTask, ...old];
        }
      );

      return { previousTasks };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        GET_ALL_FROM_TODAY_QUERY_KEY,
        context?.previousTasks
      );
    },
    onSettled: (task) => {
      queryClient.invalidateQueries(GET_ALL_FROM_TODAY_QUERY_KEY);
      if (task) {
        setText("");
        setDeadlineStr(undefined);
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createTask({
      text,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
    });
  };

  const hasNoData = !tasks?.length && !tasksLoading;

  return (
    <>
      <Head>
        <title>Unforgettable</title>
        <meta name="description" content="An app to remember everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1>Tasks</h1>
        {tasksLoading && <p>Loading tasks...</p>}
        {hasNoData && <p>no tasks :/</p>}
        <ul>
          {tasks?.map(({ id, text }) => (
            <li key={id}>{text}</li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <input
            required
            value={text}
            onInput={(e) => setText(e.currentTarget.value)}
            placeholder="Something to do today?"
            name="text"
            type="text"
          />

          {/* TODO: use better timepicker */}
          <input
            name="deadline"
            type="date"
            value={deadlineStr}
            onChange={(e) => setDeadlineStr(e.currentTarget.value)}
          />
          <button disabled={createTaskLoading}>Add task</button>
        </form>
      </main>
    </>
  );
};

export default Tasks;
