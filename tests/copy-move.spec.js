import { expect, test } from '@playwright/test'

test('dragend dropEffect with effectAllowed copyMove and a dragover that only calls preventDefault', async ({ page, browserName }) => {
  await page.goto(new URL('../docs/copy-move.html', import.meta.url).href)

  await page.locator('#source').hover()
  await page.mouse.down()
  await page.locator('#target').hover()
  await page.mouse.up()

  const result = page.locator('#result')
  await expect(result).not.toBeEmpty()
  const dropEffect = await result.textContent()
  console.log(`[${browserName} ${process.platform}] copyMove dropEffect = ${dropEffect}`)
  test.info().annotations.push({ type: 'dropEffect', description: dropEffect })
  expect(['copy', 'move']).toContain(dropEffect)
})
