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
const defaultProjectResourceSelect =
  Prisma.validator<Prisma.ProjectResourceSelect>()({
    id: true,
    Resource: {
      select: {
        id: true,
        name: true,
      },
    },
  });

export const projectResourceRouter = router({
  list: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const items = await prisma.projectResource.findMany({
        select: defaultProjectResourceSelect,
        where: {
          projectId: input.projectId,
        },
      });

      return {
        items: items,
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        resourceId: z.number(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const projectResource = await prisma.projectResource.create({
        data: {
          resourceId: input.resourceId,
          projectId: input.projectId,
        },
        select: defaultProjectResourceSelect,
      });
      return projectResource;
    }),
});
