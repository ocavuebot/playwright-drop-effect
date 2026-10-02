# playwright-drop-effect

A minimal reproduction: after a mouse drag in Playwright, the `dragend` event on the drag source can report a `dataTransfer.dropEffect` that a real browser never reports.

- Manual test page: <https://ocavuebot.github.io/playwright-drop-effect/>
- Automated results: open the latest run of the [Test workflow](https://github.com/ocavuebot/playwright-drop-effect/actions/workflows/test.yml) and read the summary of the `report` job.

## What the page does

[`docs/index.html`](docs/index.html) has one draggable source and five drop targets. The source sets `effectAllowed = 'copyMove'`. On `dragend`, the page records `event.dataTransfer.dropEffect`.

| Target | What it does on `dragover` | `dropEffect` on `dragend` in a real browser |
| --- | --- | --- |
| Zone 1 | Calls `preventDefault()` | `move` |
| Zone 2 | Calls `preventDefault()` and sets `dropEffect = 'move'` | `move` |
| Zone 3 | Calls `preventDefault()` and sets `dropEffect = 'copy'` | `copy` |
| Zone 4 | Nothing. The drop is rejected. | `none` |
| Zone 5 | A native `<textarea>` | `copy` |

The values in the last column come from manual drags in Chrome 154 and Safari 26 on macOS.

## The automated test

[`tests/drop-effect.spec.js`](tests/drop-effect.spec.js) opens the same page and drags the source onto each target with `page.mouse`. It then compares the recorded values with the table above.

The workflow runs the test on three operating systems (Ubuntu, macOS, Windows) and three browsers (Chromium, Firefox, WebKit). The `report` job prints one table for all nine combinations.

## Run it locally

```sh
npm ci
npx playwright install
npx playwright test
node scripts/report.js results
```

To use the page by hand, run `npm run serve` and open <http://localhost:4173>.
