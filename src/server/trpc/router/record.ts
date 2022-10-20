import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const CONTENT_MIN_LENGTH = 5;

export const recordRouter = router({
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(CONTENT_MIN_LENGTH, {
          message: `Record must be at least ${CONTENT_MIN_LENGTH} characters long.`,
        }),
        deadline: z
          .date()
          .min(new Date(), { message: "A deadline must be greater than today" })
          .nullable(),
      })
    )
    .mutation(({ input: { content, deadline }, ctx }) => {
      return ctx.prisma.record.create({
        data: {
          content,
          deadline,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.record.findMany();
  }),
});
