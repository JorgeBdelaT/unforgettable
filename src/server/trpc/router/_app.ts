// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { taskRouter } from "./task";
import { authRouter } from "./auth";
import { listRouter } from "./list";

export const appRouter = router({
  lists: listRouter,
  tasks: taskRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
