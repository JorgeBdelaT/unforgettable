import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { unstable_getServerSession as getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: { from: ctx.req.url },
    };
  }
  return { props: {} };
};

const Auth: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inolvidable</title>
        <meta name="description" content="Una aplicación para recordar todo." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-full flex-col items-center justify-center gap-2 px-4 py-8">
        <div className="mt-auto mb-10">
          <Image
            src="/android-chrome-192x192.png"
            alt="logo"
            width={120}
            height={120}
          />
        </div>
        <h1 className="text-2xl font-light">
          Bienvenid@ a <span className="font-semibold">Inolvidable</span>
        </h1>
        <h2 className="text-sm font-light text-slate-400">
          Una aplicación para recordarlo todo!
        </h2>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="mt-auto flex items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white shadow-xl hover:animate-bounce hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
        >
          <svg
            className="mr-2 -ml-1 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Iniciar sesion con google
        </button>
      </section>
    </>
  );
};

export default Auth;
