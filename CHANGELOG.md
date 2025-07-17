# Changelog

UpTab adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [V1.2.3] — 2025-07-17

### ✨ Added

- Added two new backgrounds. Thanks, Max! 👏

## [V1.2.2] — 2024-09-05

### ♻️ Changed

- Updated favicon service as the old one was discontinued.
- Moved feedback form to side panel

## [V1.2.1] — 2024-07-26

### ✨ Added

- A new background: a photograph of the "Lage Zwaluwe - 's Hertogenbosch" railway. Thanks for the contribution, Max!
- Two more new backgrounds: Tivoli Vredenburg in Utrecht and a bad-ass Dutch Castle

### ♻️ Changed

- Various dependency updates

## [V1.2.0] — 2024-02-16

### ✨ Added

- Added Settings: customize your UpTab experience by enabling or disabling features!
- Persist Sidebar open/close status across uses
- Added caching for reverse geocoding: improving start up speed

### 🐛 Fixed

- Fixed background color for Firefox selects
- Fixed Modal vertical overflows by making them scrollable

### ♻️ Changed

- Improve CI by upgrading to Bun instead of node
- Include release builds in CI
- Refactored Hotkeys to reduce loose use of keys
- Extracted reusable Button component

## [V1.1.0] — 2024-02-10

### ✨ Added

- Added lazy-loading for Bookmark favicons
- Added changelog, retrospectively add `V1.0.1` and `V1.0.0` changelogs
- Added changelog page, shown when UpTab is updated

### ♻️ Changed

- Updated README chrome store link
- Code refactors to improve code quality
- Reduce how often Easter eggs are added

## [V1.0.1] — 2023-12-10

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

## [V1.0.0] — 2023-12-02

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

[V1.2.1]: https://github.com/AJGeel/uptab/compare/v1.2.2...v1.2.1
[V1.2.1]: https://github.com/AJGeel/uptab/compare/v1.2.1...v1.2.0
[V1.2.0]: https://github.com/AJGeel/uptab/compare/v1.2.0...v1.1.0
[V1.1.0]: https://github.com/AJGeel/uptab/compare/v1.1.0...v1.0.1
[V1.0.1]: https://github.com/AJGeel/uptab/compare/v1.0.0...v1.0.1
[V1.0.0]: https://github.com/AJGeel/uptab/releases/tag/V1.0.0
