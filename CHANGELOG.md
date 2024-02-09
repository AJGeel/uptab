# Changelog

UpTab adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## V1.1.0 — Unreleased

### ✨ Added

- Added lazy-loading for Bookmark favicons
- Added changelog, retrospectively add `V1.0.1` and `V1.0.0` changelogs
- Added changelog page, shown when UpTab is updated

### ♻️ Changed

- Updated README chrome store link
- Code refactors to improve code quality

## V1.0.1 — 2023-12-10

### ✨ Added

- Added feedback form link
- Automate submissions for Chrome Web Store using Submit API
- Start implementing Firefox Plugin Store submissions using API
- Added dependabot for managing dependencies

### 🐛 Fixed

- Update Geolocation service: previous service broke due to requiring a paid API key
- Fix stale Geolocation cache issue

### 🧹 Removed

- CTRL+U command to open popup due to Firefox submission errors

### ♻️ Changed

- Upgrade dependencies: Tanstack Query 5.15.0, Vite 5.0.12

## V1.0.0 — 2023-12-02

### ✨ Added

- Added New Tab functionalities:
  - Added dynamic backgrounds shown when opening a new tab
  - Added weather widget: showing temperature and weather type for your geolocation
  - Added reverse geocoding API: translating your geolocation into a city/area
  - Added calendar widget: showing current day and week
  - Added Shortlinks: allowing you to store
  - Added Bookmarks: allowing you to easily view, open and delete your browser bookmarks
  - Added shortkeys to hide/close sidebar using `/`
  - Added shortkeys modal that shows configured shortcuts, shown using `?`
- Added Popup functionalities:
  - Added Bookmarks: allowing you to easily view, open and delete your browser bookmarks
  - Added `CTRL+U` shortkey to open popup
