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
const defaultProjectStartIntervalSelect =
  Prisma.validator<Prisma.ProjectStartIntervalSelect>()({
    id: true,
    projectId: true,
    endDate: true,
    startDate: true,
  });

export const projectStartIntervalRouter = router({
  list: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const items = await prisma.projectStartInterval.findMany({
        select: defaultProjectStartIntervalSelect,
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return {
        items: items,
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await prisma.projectStartInterval.create({
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          projectId: input.projectId,
        },
        select: defaultProjectStartIntervalSelect,
      });
      return project;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await prisma.projectStartInterval.update({
        where: {
          id: input.id,
        },
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
        },
        select: defaultProjectStartIntervalSelect,
      });
      return project;
    }),
});
