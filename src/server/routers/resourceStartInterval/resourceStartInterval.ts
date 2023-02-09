/* eslint-disable prettier/prettier */
/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '~/server/trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { DateTime, Interval } from 'luxon';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultResourceStartIntervalSelect =
  Prisma.validator<Prisma.ResourceStartIntervalSelect>()({
    id: true,
    projectResourceId: true,
    endDate: true,
    startDate: true,
  });

export const resourceStartIntervalRouter = router({
  list: publicProcedure
    .input(
      z.object({
        projectResourceId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const items = await prisma.resourceStartInterval.findMany({
        select: defaultResourceStartIntervalSelect,
        where: {
          projectResourceId: input.projectResourceId,
        },
      });

      return {
        items: items.reverse(),
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        projectResourceId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await prisma.resourceStartInterval.create({
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          projectResourceId: input.projectResourceId,
        },
        select: defaultResourceStartIntervalSelect,
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
      const resourceStartInterval = await prisma.resourceStartInterval.update({
        where: {
          id: input.id,
        },
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
        },
        select: defaultResourceStartIntervalSelect,
      });
      await resourceIsDoubleBooked(resourceStartInterval.projectResourceId)

      return resourceStartInterval;
    }),
});

async function resourceIsDoubleBooked(projectResourceId: number){
  // get resource id from projectResource
  const projectResource = await prisma.projectResource.findFirst({
    select: { resourceId: true },
    where: {
      id: projectResourceId 
    }
  })

  const projectResources = await prisma.projectResource.findMany({
    where: {
      resourceId: projectResource?.resourceId
    },
    include: {
      startIntervals: true
    }
  })
  
  // look at projectResources by resourceId
  // fetch all start interval by projectResourceId
  const startIntervals = projectResources.map((projectResource) => {
    return projectResource.startIntervals
  })

  // get all start - end dates
  // transform into date time intervals.
  const computedStartIntervals = startIntervals.flat().map((startInterval) => {
    const startDate = DateTime.fromJSDate(startInterval.startDate)
    const endDate = DateTime.fromJSDate(startInterval.endDate)

    return Interval.fromDateTimes(startDate, endDate)
  });

  // const computedDateTimes = computedStartIntervals.map((computedStartInterval) => {

  // })

  console.log(computedStartIntervals)
}