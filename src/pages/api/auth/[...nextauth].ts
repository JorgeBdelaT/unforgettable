import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { DEFAULT_LIST_NAME } from "../../../constants";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Create dedault list
        const hasLists =
          (await prisma.list.count({
            where: { users: { some: { id: user.id } } },
          })) > 0;

        if (!hasLists) {
          await prisma.list.create({
            data: {
              name: DEFAULT_LIST_NAME,
              users: { connect: { id: user.id } },
            },
          });
        }
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  secret: env.NEXT_PUBLIC_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
