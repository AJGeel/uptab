# Releasing <a name="releasing"></a>

<div style="padding: '10px', background-color: '#EFF3FA', border-radius: '4px'">
This document will serve as a to-do: notes to implement automated releasing through the stores.
Afterwards, it will be re-written to serve as documentation.
</div>

<br/>

## 1. Chrome Web Store

Before you can begin making REST calls against the Chrome Web Store, you will need to enable the Chrome Web Store API, configure your OAuth consent screen, and retrieve your API access keys.

### 1.1 Initial Setup: Auth for Chrome Web Store API

1. Follow the instructions provided on https://developer.chrome.com/docs/webstore/using-api.
2. This should provide you with a `CHROME_CLIENT_ID` and a `CHROME_CLIENT_SECRET`. Add these to your `.env`. Add the `CHROME_SUCCESS_CODE` to your clipboard.
3. Run the following command with your credentials

```
curl "https://accounts.google.com/o/oauth2/token" -d \ "client_id={{CLIENT_ID}}&client_secret={{CLIENT_SECRET}}&code={{CHROME_SUCCESS_CODE}}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

4. Store the refresh_token in `.env` as `CHROME_REFRESH_TOKEN`.
5. Optional: If your Chrome Extension is already published, store your `CHROME_EXTENSION_ID` in the `.env` too.

You can now use the commands to add, update, publish and check the status of your Chrome Extension! 🚀

### 1.2 Using the Chrome Web Store API

These are the scripts available to use the Chrome Web Store API.

- `bun chrome:store:init`
  - Add your extension to the store for the first time.
  - Requires [ 1 ].
- `bun chrome:store:status`
  - Checks the status of your extension in the store.
  - Requires [ 2 ].
- `bun chrome:store:update-package`
  - Updates your extension to the store.
  - Requires [ 1 , 2]
- `bun chrome:store:publish`
  - Publishes your extension in the store to all users.
  - Requires [ 1 , 2]

**Requirements**

1. Requires a valid build in "/dist/chrome-extension.zip"
2. Requires a valid `CHROME_EXTENSION_ID` to be set in the .env

<br/>

- [ ] Implement Firefox Store API:

https://addons-server.readthedocs.io/en/latest/topics/api/index.html

https://blog.mozilla.org/addons/2022/03/17/new-api-for-submitting-and-updating-add-ons/
