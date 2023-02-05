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
const defaultProjectSelect = Prisma.validator<Prisma.ProjectSelect>()({
  id: true,
  name: true,
});

export const projectRouter = router({
  list: publicProcedure.query(async () => {
    const items = await prisma.project.findMany({
      select: defaultProjectSelect,
    });

    return {
      items: items.reverse(),
    };
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await prisma.project.create({
        data: {
          name: input.name,
        },
        select: defaultProjectSelect,
      });
      return project;
    }),
});
