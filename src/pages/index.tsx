import type { NextPage } from "next";
import Head from "next/head";
import TasksList from "../components/TasksList";
import CreateTask from "../components/CreateTask";

const Tasks: NextPage = () => {
  return (
    <>
      <Head>
        <title>Unforgettable</title>
        <meta name="description" content="An app to remember everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <h1 className="mb-6 text-2xl font-medium text-gray-200">Tareas</h1>
        <TasksList />
        <CreateTask />
      </section>
    </>
  );
};

export default Tasks;
