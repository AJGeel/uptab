# Setup <a name="setup"></a>

You need [Bun](https://bun.sh/).

```sh
bun install
cp .env.example .env  # optional for development, see below
```

`.env` holds the GlitchTip DSN for error reporting, plus the store credentials used for [releasing](/docs/2-releasing.md). You can develop without it.

<br/>

## 1. Development

### Firefox

```sh
bun dev
```

This rebuilds `dist/firefox` on every change and opens a temporary Firefox window with the extension installed. The extension reloads automatically.

### Chrome and Edge

```sh
bunx nodemon
```

This rebuilds `dist/chromium` on every change. To load it:

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select the `dist/chromium` folder.

Chrome doesn't reload unpacked extensions on its own: after a change, click the reload icon on the extension's card.

<br/>

## 2. Tests and linting

```sh
bun run test
bun run lint
```

<br/>

## 3. Production builds

```sh
bun run build  # builds dist/chromium and dist/firefox
bun ship       # builds and zips both, as submitted to the stores
```

See [Releasing](/docs/2-releasing.md) to submit a build to the stores.

<br/>

### Tech Docs <a name="tech"></a>

- [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html)
- [Chrome Extensions (Manifest V3)](https://developer.chrome.com/docs/extensions/mv3/)
- [WebExtension Polyfill 🐐](https://github.com/mozilla/webextension-polyfill)
- [Tailwind CSS](https://tailwindcss.com/docs/configuration)
