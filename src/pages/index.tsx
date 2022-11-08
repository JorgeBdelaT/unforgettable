import type { NextPage } from "next";
import Head from "next/head";

import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

import { CreateTask, Header, TasksList } from "../components";
import { GET_ALL_TASKS_QUERY_KEY } from "../components/CreateTask/CreateTask";

import { trpc } from "../utils/trpc";

const Tasks: NextPage = () => {
  const queryClient = useQueryClient();

  const { mutate: undoLastRemoval, isLoading: undoLastRemovalLoading } =
    trpc.tasks.undoLastRemoval.useMutation({
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo restaurar la tarea :(`);
      },
      onSettled: () => {
        queryClient.invalidateQueries(GET_ALL_TASKS_QUERY_KEY);
      },
    });

  return (
    <>
      <Head>
        <title>Unforgettable</title>
        <meta name="description" content="An app to remember everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-full flex-col">
        <Header
          title="Tareas"
          actions={
            <button
              disabled={undoLastRemovalLoading}
              onClick={() => undoLastRemoval()}
              className="text-slate-800 disabled:pointer-events-none disabled:text-slate-500"
            >
              <ArrowUturnLeftIcon className="h-6 w-6" />
            </button>
          }
        />
        <TasksList />
        <CreateTask />
      </section>
    </>
  );
};

export default Tasks;
