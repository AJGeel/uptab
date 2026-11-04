---
name: changelog
description: Write or rewrite an UpTab release entry in CHANGELOG.md. Use when preparing a release, or asked to draft, shorten or review the changelog.
---

# Changelog

Users read the entry in a small update notification, in a few seconds. Write for that. Less is more: the entry is a teaser, not a record.

## Gather

Read the commits since the last release (`git log <last-tag>..HEAD`, bodies included) and the current top entry. The commits are the source of truth. Then pick the few things that matter and drop the rest.

## Budget

Hard limits, counted in bullets across the whole entry. A bullet is one line.

- **Major**: up to ~6 bullets. 2.0.0 is the ceiling: a few headline features, a sub-list only where it really helps.
- **Minor**: 2-4 feature bullets, plus a few one-line fixes. Headline features only. Only a truly awesome feature may use a major-sized budget, and that is rare.
- **Patch**: 1-2 bullets. No sub-lists.

Over budget? Cut the least exciting bullet, don't compress the rest.

## What makes the cut

Judge by user impact: would a user notice it, or do something new because of it? Ask of each change: "what can they do now, or what's different for them?" No answer, no bullet.

In:
- A new thing users can do.
- A change they'll notice straight away.
- Fixes for bugs users really ran into, in a short `Fixed` section. Visible glitches count, like content jumping around as it loads: they make the extension feel unpolished.

Out, however much work it was:
- Polish nobody consciously notices: clearer focus outlines, friendlier or reworded messages (loading, errors, help text), animations.
- Small flows around an existing feature, like Enter to add the top city result.
- Behind the scenes: dependency or library swaps, refactors, docs, tooling, store screenshots.
- Fixes to bugs that barely anyone saw, such as an edge case in a rare setup.

Bundle related changes into one bullet. A redesigned settings menu is one bullet, not its five options.

## Writing

- Speak to the user, about what they can do.
- One short sentence, ideally under ~15 words. Lead with the benefit.
- No explanations of how it works, no caveats, no permission details. The feature explains itself.
- Name keys with `<kbd>`, like `<kbd>B</kbd>`.
- Plain tone. No marketing words.

## Format

Keep the structure, as the app parses it. Omit empty sections, in this order:

```
## [V2.1.0] — YYYY-MM-DD

### ✨ Added
### ♻️ Changed
### 🐛 Fixed
```

Use the release date, today's if it ships tonight.
