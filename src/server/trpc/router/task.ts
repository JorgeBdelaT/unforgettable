import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const TEXT_MIN_LENGTH = 5;

const getShortDate = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setMilliseconds(0);
  return date;
};

export const taskRouter = router({
  create: publicProcedure
    .input(
      z.object({
        text: z
          .string()
          .trim()
          .min(TEXT_MIN_LENGTH, {
            message: `Record must be at least ${TEXT_MIN_LENGTH} characters long.`,
          }),
        deadline: z
          .date()
          .min(new Date(), { message: "A deadline must be greater than today" })
          .nullable(),
      })
    )
    .mutation(async ({ input: { text, deadline }, ctx }) => {
      const priority = (await ctx.prisma.task.count()) + 1;
      return ctx.prisma.task.create({
        data: {
          text,
          deadline,
          priority,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ taskId: z.string().cuid() }))
    .mutation(({ ctx, input: { taskId } }) => {
      return ctx.prisma.task.deleteMany({
        where: { id: taskId },
      });
    }),

  toggleCompletedState: publicProcedure
    .input(z.object({ taskId: z.string().cuid() }))
    .mutation(({ ctx, input: { taskId } }) => {
      return ctx.prisma.task.update({
        where: { id: taskId },
        data: {
          completed: true,
        },
      });
    }),

  changePriority: publicProcedure
    .input(z.object({ taskId: z.string().cuid(), priority: z.number().min(0) }))
    .mutation(({ ctx, input: { taskId, priority } }) => {
      return ctx.prisma.task.update({
        where: { id: taskId },
        data: {
          priority,
        },
      });
    }),

  getAllFromToday: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      orderBy: { priority: "desc" },
      where: { createdAt: { gte: getShortDate() } },
    });
  }),
});