import { appendFileSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

function findResults(directory) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...findResults(path))
    else if (entry.name.endsWith('.json')) files.push(path)
  }
  return files
}

const directory = process.argv[2] ?? 'results'
const results = findResults(directory)
  .map((file) => JSON.parse(readFileSync(file, 'utf8')))
  .sort((a, b) => `${a.browser} ${a.os}`.localeCompare(`${b.browser} ${b.os}`))

const zones = results[0]?.rows.map((row) => row.zone) ?? []
const lines = []
lines.push('## `dropEffect` in `dragend`')
lines.push('')
lines.push('Source: `effectAllowed = "copyMove"`. A cell shows the value that the source reads in `dragend`.')
lines.push('')
lines.push(`| Browser | OS | ${zones.join(' | ')} |`)
lines.push(`| --- | --- | ${zones.map(() => '---').join(' | ')} |`)
lines.push(`| **Expected** | | ${(results[0]?.rows ?? []).map((row) => `\`${row.expected}\``).join(' | ')} |`)
for (const result of results) {
  const cells = result.rows.map((row) => {
    const ok = row.dropEffectInDragend === row.expected
    return `${ok ? '✅' : '❌'} \`${row.dropEffectInDragend}\``
  })
  lines.push(`| ${result.browser} ${result.browserVersion} | ${result.os} | ${cells.join(' | ')} |`)
}
lines.push('')
lines.push('## `dropEffect` in `drop`')
lines.push('')
lines.push(`| Browser | OS | ${zones.join(' | ')} |`)
lines.push(`| --- | --- | ${zones.map(() => '---').join(' | ')} |`)
for (const result of results) {
  const cells = result.rows.map((row) => (row.dropFired ? `\`${row.dropEffectInDrop}\`` : 'no `drop`'))
  lines.push(`| ${result.browser} ${result.browserVersion} | ${result.os} | ${cells.join(' | ')} |`)
}
lines.push('')

const markdown = lines.join('\n')
console.log(markdown)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n')
