# Releasing <a name="releasing"></a>

This document will serve as a to-do: notes to implement automated releasing through the stores.

Afterwards, it will be re-written to serve as documentation.

<br/>

## Chrome Web Store

Before you can begin making REST calls against the Chrome Web Store, you will need to enable the Chrome Web Store API, configure your OAuth consent screen, and retrieve your API access keys.

### Initial Setup: Enable the Chrome Web Store API

1. Follow the instructions provided on https://developer.chrome.com/docs/webstore/using-api.
2. This should provide you with a CHROME_CLIENT_ID and a CHROME_CLIENT_SECRET. Add these to the `.env`. Keep note of the CHROME_SUCCESS_CODE to your clipboard.
3. Run the following command with your credentials

```
> curl "https://accounts.google.com/o/oauth2/token" -d \
"client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&code=$CODE&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```

4. Store the refresh_token in `.env` as CHROME_REFRESH_TOKEN.

You are now ready to go.

— — — — —
— — — — —
— — — — —

To Do's:

- [ ] Implement Chrome Webstore API:

https://developer.chrome.com/docs/webstore/using-api

<br/>

- [ ] Implement Firefox Store API:

https://addons-server.readthedocs.io/en/latest/topics/api/index.html

https://blog.mozilla.org/addons/2022/03/17/new-api-for-submitting-and-updating-add-ons/
