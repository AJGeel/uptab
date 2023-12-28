# Setup <a name="setup"></a>

1. Run `npm install` (check your node version >= 16)
1. Load Extension:
   1. Make sure you have `npm run dev` running for hot reloading.
   1. Chrome and Edge
      1. Change the `src/config/buildTarget.ts` file so that `buildTarget = TARGETS.CHROME`.
      1. Open - Chrome/Edge browser.
      1. Access - `chrome://extensions` / `edge://extensions`.
      1. Check - Developer mode.
      1. Find - Load unpacked extension.
      1. Select - `dist/chromium` folder in this project (after dev or build)
   1. Firefox:
      1. Change the `src/config/buildTarget.ts` file so that `buildTarget = TARGETS.FIREFOX`.
      1. run `npm run load:firefox`.
      1. It should open a `web-ext` faux FireFox browser with the extension running.
1. If you want to build for production, run `npm run build`. Remember to create separate builds for Firefox and Chromium by editing `src/config/buildTarget.ts`.

Tailwind can be configured in the `tailwind.config.cjs` file. See doc link below.

<br/>

### Tech Docs <a name="tech"></a>

- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [Chrome Extension with manifest 3](https://developer.chrome.com/docs/extensions/mv3/)
- [WebExtension Polyfill 🐐](https://github.com/mozilla/webextension-polyfill)
- [Rollup](https://rollupjs.org/guide/en/)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)
- [Tailwind CSS](https://tailwindcss.com/docs/configuration)
