// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { recordRouter } from "./record";
import { authRouter } from "./auth";

export const appRouter = router({
  records: recordRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
