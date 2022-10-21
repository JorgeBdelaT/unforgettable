// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { recordRouter } from "./record";
import { taskRouter } from "./task";
import { authRouter } from "./auth";

export const appRouter = router({
  records: recordRouter,
  tasks: taskRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
