import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import { Header, SignOutBtn, UserLists } from "../../components";

import { ROUTES } from "../../constants";

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

const Lists: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inolvidable | Listas</title>
        <meta name="description" content="Una aplicación para recordar todo." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-full flex-col">
        <Header title="Listas" actions={<SignOutBtn />} />
        <UserLists />
        {/* TODO: <CreateList /> */}
      </section>
    </>
  );
};

export default Lists;
