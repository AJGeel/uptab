# History permission (2.1.0)

2.1.0 adds an **optional** `history` permission. It isn't requested on install or update, only when someone first sorts bookmarks by "Recently visited" or "Most visited". Update the store listings when submitting 2.1.0.

## Chrome Web Store

**Privacy practices → permission justification** (optional permission `history`):

> UpTab reads the browser history only to sort the user's bookmarks by how recently and how often they visited them. It looks up each bookmarked page's own visits, and nothing else in the history. It's requested only when the user chooses one of those sort options, and the user can decline it or remove it at any time in the extension's settings.

**Privacy policy / data disclosure:** the history is read on the device, used only for sorting, and never stored, sent or shared. If the policy lists the data UpTab handles, add "browsing history (optional, on the device only)".

## Firefox Add-ons

- **Optional permission:** "Read your browsing history", requested when sorting by visits.
- **Listing / privacy notes:** the same wording as above. Reviewers may ask why `history` is needed: the answer is in the justification.
- `web-ext lint` shows no errors for the new permission.
