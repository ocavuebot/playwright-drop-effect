# playwright-drop-effect

A minimal reproduction of a Playwright WebKit bug: after a mouse drag, `dataTransfer.dropEffect` in the `dragend` event is not the value that the drop target set.

- Issue: <https://github.com/microsoft/playwright/issues/43082>
- Page: [`docs/index.html`](docs/index.html), online at <https://ocavuebot.github.io/playwright-drop-effect/>
- Test: [`tests/drop-effect.spec.js`](tests/drop-effect.spec.js)
- Results: the [Test workflow](https://github.com/ocavuebot/playwright-drop-effect/actions/workflows/test.yml) runs the test on Ubuntu, macOS, and Windows with Chromium, Firefox, and WebKit.

The drop target sets `dropEffect = 'copy'` on `dragover`. The source must read `copy` in `dragend`.

| Browser | Result |
| --- | --- |
| Chromium | `copy` |
| Firefox | `copy` |
| WebKit | `all` |

## Run it locally

```sh
npm ci
npx playwright install
npx playwright test
```
