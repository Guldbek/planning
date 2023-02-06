/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '~/server/context';
import { AppRouter, appRouter } from '~/server/routers/_app';
import { inferProcedureInput } from '@trpc/server';

test('add and get post', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const projectAdd: inferProcedureInput<AppRouter['project']['add']> = {
    name: 'hello test',
  };

  const addProject = caller.project.add(projectAdd);

  const projectStartIntervalAdd: inferProcedureInput<
    AppRouter['projectStartInterval']['add']
  > = {
    projectId: addProject.id,
    startDate: Date.now(),
    endDate: Date.now(),
  }

  const addProjectStartInterval = caller.projectStartInterval.add(
    projectStartIntervalAdd,
  );
  const list = caller.projectStartInterval.list(addProject.id);

  expect(list).toMatchObject(addProjectStartInterval);
});
