// src/server/trpc/router/_app.ts
import { authRouter } from "./auth";
import { listRouter } from "./list";
import { router } from "../trpc";
import { taskRouter } from "./task";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  lists: listRouter,
  tasks: taskRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
