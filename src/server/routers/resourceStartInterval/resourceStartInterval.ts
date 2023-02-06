/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '~/server/trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultResourceStartIntervalSelect =
  Prisma.validator<Prisma.ResourceStartIntervalSelect>()({
    id: true,
    resourceId: true,
    endDate: true,
    startDate: true,
  });

export const resourceStartIntervalRouter = router({
  list: publicProcedure
    .input(
      z.object({
        resourceId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const items = await prisma.resourceStartInterval.findMany({
        select: defaultResourceStartIntervalSelect,
        where: {
          resourceId: input.resourceId,
        },
      });

      return {
        items: items.reverse(),
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        resourceId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await prisma.resourceStartInterval.create({
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          resourceId: input.resourceId,
        },
        select: defaultResourceStartIntervalSelect,
      });
      return project;
    }),
});
