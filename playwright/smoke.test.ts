import { test, expect } from '@playwright/test';

test.setTimeout(35e3);

test('go to /planning', async ({ page }) => {
  await page.goto('/planning');

  await page.waitForSelector(`text=Projekter`);
});

test('test 404', async ({ page }) => {
  const res = await page.goto('/post/not-found');
  expect(res?.status()).toBe(404);
});

test('add a post', async ({ page, browser }) => {
  const nonce = `${Math.random()}`;

  await page.goto('/planning');
  await page.getByText(`Tilføj projekt`).click();
  await page.fill(`[name=project_name]`, nonce);
  await page.click(`form [type=submit]`);
  await page.waitForLoadState('networkidle');

  expect(await page.content()).toContain(nonce);
});
