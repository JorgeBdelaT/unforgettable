import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import moment from "moment";

export const listRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().trim(),
      })
    )
    .mutation(async ({ input: { name }, ctx }) => {
      return ctx.prisma.list.create({
        data: {
          name,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ listId: z.string().cuid() }))
    .mutation(({ ctx, input: { listId } }) => {
      return ctx.prisma.list.delete({
        where: { id: listId },
      });
    }),

  // TODO: edit name

  getAll: publicProcedure.query(async ({ ctx }) => {
    const maxCompletedDate = moment(new Date()).subtract(24, "h").toDate();

    const userLists = await ctx.prisma.list.findMany({
      where: { users: { some: { id: ctx.session?.user?.id } } },
      include: {
        tasks: { where: { deletedAt: null } },
        _count: { select: { users: true } },
      },
    });

    return userLists.map((list) => ({
      ...list,
      tasks: list.tasks.filter(
        ({ completed, completedAt }) =>
          !completed ||
          (completed && completedAt && completedAt >= maxCompletedDate)
      ),
    }));
  }),
});
