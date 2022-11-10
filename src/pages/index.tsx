import type { NextPage } from "next";
import Head from "next/head";

import {
  CreateTask,
  Header,
  TasksList,
  ToggleCompletedTasksVisibilityBtn,
  UndoLastTaskRemovalBtn,
} from "../components";

const Tasks: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inolvidable</title>
        <meta name="description" content="Una aplicación para recordar todo." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-full flex-col">
        <Header
          title="Tareas"
          actions={
            <>
              <UndoLastTaskRemovalBtn />
              <ToggleCompletedTasksVisibilityBtn />
            </>
          }
        />
        <TasksList />
        <CreateTask />
      </section>
    </>
  );
};

export default Tasks;
