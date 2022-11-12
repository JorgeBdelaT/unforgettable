import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { Task } from "@prisma/client";
import moment from "moment";

export const taskRouter = router({
  create: publicProcedure
    .input(
      z.object({
        text: z.string().trim(),
        deadline: z
          .date()
          .min(new Date(), { message: "A deadline must be greater than today" })
          .nullish(),
        listId: z.string().cuid(),
      })
    )
    .mutation(async ({ input: { text, deadline, listId }, ctx }) => {
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
          listId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ taskId: z.string().cuid() }))
    .mutation(async ({ ctx, input: { taskId } }) => {
      await ctx.prisma.task.update({
        where: { id: taskId },
        data: { deletedAt: new Date() },
      });
    }),

  undoLastRemoval: publicProcedure
    .input(z.object({ listId: z.string().cuid() }))
    .mutation(async ({ ctx, input: { listId } }) => {
      const latestRemoval = (
        await ctx.prisma.task.findMany({
          where: { listId, deletedAt: { not: null } },
          orderBy: { deletedAt: "desc" },
        })
      )[0];

      if (latestRemoval) {
        await ctx.prisma.task.update({
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
            completedAt: !task.completed ? new Date() : null,
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

  getAll: publicProcedure
    .input(z.object({ listId: z.string().cuid().nullish() }))
    .query(async ({ ctx, input: { listId } }) => {
      if (listId) {
        const maxCompletedDate = moment(new Date()).subtract(24, "h").toDate();
        const allTasks = await ctx.prisma.task.findMany({
          where: { deletedAt: null, listId },
          orderBy: { priority: "desc" },
        });
        return allTasks.filter(
          ({ completed, completedAt }) =>
            !completed ||
            (completed && completedAt && completedAt >= maxCompletedDate)
        );
      }
    }),
});
