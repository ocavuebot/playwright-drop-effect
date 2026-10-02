import { mkdirSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import { expect, test } from '@playwright/test'

const ZONES = [
  { id: 'zone-default', expected: 'move' },
  { id: 'zone-move', expected: 'move' },
  { id: 'zone-copy', expected: 'copy' },
  { id: 'zone-reject', expected: 'none' },
  { id: 'zone-textarea', expected: 'copy' },
]

test('dragend reports the dropEffect that the drop target accepted', async ({ page, browserName, browser }) => {
  await page.goto('/')

  for (const zone of ZONES) {
    await page.locator('#source').hover()
    await page.mouse.down()
    await page.locator(`#${zone.id}`).hover()
    await page.locator(`#${zone.id}`).hover()
    await page.mouse.up()
    await page.waitForTimeout(200)
  }

  const rows = await page.evaluate(() => window.dropEffectRows)
  const result = {
    os: process.env.RESULT_OS || os.platform(),
    browser: browserName,
    browserVersion: browser.version(),
    userAgent: await page.evaluate(() => navigator.userAgent),
    rows: rows.map((row, index) => ({ ...row, zone: ZONES[index]?.id, expected: ZONES[index]?.expected })),
  }
  mkdirSync('results', { recursive: true })
  writeFileSync(`results/${result.os}-${browserName}.json`, JSON.stringify(result, null, 1))
  console.log(JSON.stringify(result, null, 1))

  expect(rows).toHaveLength(ZONES.length)
  for (const [index, zone] of ZONES.entries()) {
    expect.soft(rows[index].dropEffectInDragend, `dragend dropEffect after a drop on ${zone.id}`).toBe(zone.expected)
  }
})
