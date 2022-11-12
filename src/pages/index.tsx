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
import useSelectedListStore from "../stores/SelectedListStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ROUTES } from "../constants";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: ROUTES.auth,
        permanent: false,
      },
      props: { from: ctx.req.url },
    };
  }
  return { props: {} };
};

const Tasks: NextPage = () => {
  const selectedList = useSelectedListStore((state) => state.selectedList);

  const [headetTitle, setHeaderTitle] = useState("tareas");

  const router = useRouter();

  useEffect(() => {
    if (!selectedList) router.push(ROUTES.lists);
    else setHeaderTitle(selectedList.name);
  }, [selectedList, router]);

  return (
    <>
      <Head>
        <title>Inolvidable | Tareas</title>
        <meta name="description" content="Una aplicación para recordar todo." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-full flex-col">
        <Header
          backUrl={ROUTES.lists}
          title={headetTitle}
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
