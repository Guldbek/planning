/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc';
import { projectRouter } from './project/project';
import { projectStartIntervalRouter } from './projectStartInterval/projectStartInterval';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  project: projectRouter,
  projectStartInterval: projectStartIntervalRouter,
});

export type AppRouter = typeof appRouter;
