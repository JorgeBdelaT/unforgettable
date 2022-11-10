import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import {
  CreateTask,
  Header,
  SignOutBtn,
  TasksList,
  ToggleCompletedTasksVisibilityBtn,
  UndoLastTaskRemovalBtn,
} from "../components";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
      props: { from: ctx.req.url },
    };
  }
  return { props: {} };
};

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
              <SignOutBtn />
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
