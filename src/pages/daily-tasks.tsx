import type { NextPage } from "next";
import Head from "next/head";
import DailyTasksList from "../components/DailyTasksList";
import CreateTask from "../components/CreateTask";

const Tasks: NextPage = () => {
  return (
    <>
      <Head>
        <title>Unforgettable</title>
        <meta name="description" content="An app to remember everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-8">
        <h1>Tareas</h1>
        <DailyTasksList />
        <CreateTask />
      </main>
    </>
  );
};

export default Tasks;
