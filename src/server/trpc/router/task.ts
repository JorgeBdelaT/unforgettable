import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { Task } from "@prisma/client";
import moment from "moment";

const TEXT_MIN_LENGTH = 5;

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
          .nullish(),
      })
    )
    .mutation(async ({ input: { text, deadline }, ctx }) => {
      const priority =
        (await ctx.prisma.task.findMany()).reduce(
          (maxPriority, { priority }) => {
            if (priority > maxPriority) {
              maxPriority = priority;
            }
            return maxPriority;
          },
          0
        ) + 1;

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
      return ctx.prisma.task.update({
        where: { id: taskId },
        data: { deletedAt: new Date() },
      });
    }),

  undoLastRemoval: publicProcedure.mutation(async ({ ctx }) => {
    const latestRemoval = (await ctx.prisma.task.findMany()).reduce(
      (acc, curr) => {
        // TODO: redactor
        if (
          (acc?.deletedAt &&
            curr?.deletedAt &&
            curr.deletedAt > acc.deletedAt) ||
          !acc
        ) {
          acc = curr;
        }
        return acc;
      },
      null as Task | null
    );

    if (latestRemoval) {
      return ctx.prisma.task.update({
        where: { id: latestRemoval.id },
        data: { deletedAt: null },
      });
    }
  }),

  toggleCompletedState: publicProcedure
    .input(z.object({ taskId: z.string().cuid() }))
    .mutation(async ({ ctx, input: { taskId } }) => {
      const task = await ctx.prisma.task.findUnique({ where: { id: taskId } });
      if (task)
        return ctx.prisma.task.update({
          where: { id: taskId },
          data: {
            completed: !task.completed,
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

  getAll: publicProcedure.query(async ({ ctx }) => {
    const maxCompletedDate = moment(new Date()).subtract(24, "h").toDate();
    const allTasks = await ctx.prisma.task.findMany({
      where: { deletedAt: null },
      orderBy: { priority: "desc" },
    });
    return allTasks.filter(
      ({ completed, updatedAt }) =>
        !completed || (completed && updatedAt >= maxCompletedDate)
    );
  }),
});
