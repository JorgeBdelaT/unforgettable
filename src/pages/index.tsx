import type { NextPage } from "next";
import Head from "next/head";
import TasksList from "../components/TasksList";
import CreateTask from "../components/CreateTask";
import { trpc } from "../utils/trpc";
import { GET_ALL_TASKS_QUERY_KEY } from "../components/CreateTask/CreateTask";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

const Tasks: NextPage = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = trpc.tasks.undoLastRemoval.useMutation({
    onError: (err, _, context) => {
      // TODO: do something better with the error
      window.alert(`No se pudo restaurar la tarea :(`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(GET_ALL_TASKS_QUERY_KEY);
    },
  });

  const handleUndoLastTaskRemoval = () => {
    if (!isLoading) mutate();
  };

  return (
    <>
      <Head>
        <title>Unforgettable</title>
        <meta name="description" content="An app to remember everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-full flex-col">
        <div className="container mb-16 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-gray-200">Tareas</h1>
          <button
            onClick={handleUndoLastTaskRemoval}
            className="text-slate-800"
          >
            {isLoading ? "......." : <ArrowUturnLeftIcon className="h-6 w-6" />}
          </button>
        </div>

        <TasksList />
        <CreateTask />
      </section>
    </>
  );
};

export default Tasks;
