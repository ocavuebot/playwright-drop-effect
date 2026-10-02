import { expect, test } from '@playwright/test'

test('dragend reports the dropEffect that the drop target set', async ({ page }) => {
  await page.goto(new URL('../docs/index.html', import.meta.url).href)

  await page.locator('#source').hover()
  await page.mouse.down()
  await page.locator('#target').hover()
  await page.mouse.up()

  await expect(page.locator('#result')).toHaveText('copy')
})
