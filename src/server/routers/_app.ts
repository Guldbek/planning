/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { projectRouter } from './project/project';
import { projectStartIntervalRouter } from './projectStartInterval/projectStartInterval';
import { resourceRouter } from './resource/resource';
import { resourceStartIntervalRouter } from './resourceStartInterval/resourceStartInterval';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  project: projectRouter,
  projectStartInterval: projectStartIntervalRouter,
  resourceStartInterval: resourceStartIntervalRouter,
  resource: resourceRouter,
});

export type AppRouter = typeof appRouter;
