---
name: release-pr
description: Open the pull request for an UpTab release. Use when asked to make, write or update the release PR.
---

# Release PR

## Steps

1. Be on `release/x.y.z`, with everything committed and pushed. Check `gh pr list --head release/x.y.z` first: update an existing PR, don't open a second.
2. Read the commits since the last release (`git log <last-tag>..HEAD`, bodies included), and `CHANGELOG.md`.
3. Read `.github/templates/pull_request_template.md` fresh and follow it exactly, including its `## Checklist`. Never reuse a checklist from memory or an older PR: the template changes.
4. Open it with `gh pr create --base main --title "Release/x.y.z"`, body from a file.

## Body

Unlike the changelog, the PR is for the maintainer: it can be complete and technical. Still terse.

- One short line per change, under `Updates`, `Bugfixes` or `Others`. No intro, no summary paragraph.
- `Updates`: features and changes users get. `Bugfixes`: fixes. `Others`: anything behind the scenes, like dependencies, tooling, docs, and skills.
- Each commit body is a good source: its bullets are often already the lines.
- Tick what's done: `Updated CHANGELOG.md` once the entry is committed. Leave `bun store:submit` and `bun tag-release` unticked, as they happen after review and merge.
- Drop empty sections, but keep the template's headings otherwise.

## Never

- No AI attribution: no "Generated with Claude Code" footer, no `Co-Authored-By` lines, in the PR or any commit.
- Don't merge, tag or submit to the stores. Those are the user's steps.
