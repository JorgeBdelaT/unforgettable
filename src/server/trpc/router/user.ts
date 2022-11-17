import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { id: { not: ctx.session?.user?.id } },
    });
  }),
});
