/**
 * Integration test example for the `post` router
 */
import { createContextInner } from '~/server/context';
import { AppRouter, appRouter } from '~/server/routers/_app';
import { inferProcedureInput } from '@trpc/server';

test('add and get post', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter['project']['add']> = {
    name: 'hello test',
  };

  const addProject = caller.project.add(input);
  const list = caller.project.list();

  expect(list).toMatchObject(addProject);
});
