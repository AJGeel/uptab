---
name: release-audit
description: Audit an UpTab release branch before it ships. Reports a verdict and findings, changes nothing.
disable-model-invocation: true
---

# Release audit

An independent second reviewer for `release/x.y.z`. Releases are costly to undo here: the stores review them, Chrome auto-publishes on approval, and users' stored data carries over. CI already covers test, lint, typecheck, build and CodeQL, so audit what CI can't see. The audit reports only. The visual check stays manual, as the maintainer's own feel.

## 1. Facts

Run these on the release branch, diffing against `main...HEAD`. Every item ends in a pass or a quoted line of evidence.

- **Version agreement**: `package.json` version equals the top `CHANGELOG.md` heading, and differs from the version on `main` and from the latest `bun store:status`.
- **Manifest and dependencies**: the diff of `src/manifest.ts` (permissions, host permissions) and of `package.json` dependencies.
- **Build and lint**: `bun run build`, then `bun lint:firefox`, then the bundle size under `dist/` against `main`'s.
- **Untested files**: every added `src/**/*.ts(x)` with no sibling `.test.` file.
- **PR**: `gh pr view <n>` checks, and the PR body against the diff.

## 2. Lenses

Launch one read-only subagent per lens, in a single message so they run in parallel. Give each the lens text below plus the facts, point it at `git diff main...HEAD`, and ask for under 500 words.

Each subagent reports verified findings only, each as `file:line`, a concrete failure scenario (input, state, or attacker action to wrong outcome) and severity: blocker, major or minor. It also lists, one line each, what it checked and found fine.

1. **Upgrade and data safety**: a user on the previous version upgrades with stored settings, data and caches. Old persisted shapes still load, new fields have defaults, removed exports have no remaining references, storage and caches stay bounded, downgrade doesn't crash, and every dropped user preference is deliberate.
2. **Security, privacy and store policy**: permissions the stores would question, validation of user-supplied URLs, secrets in storage, logs and error reports, rendering of untrusted content (XSS, `javascript:` links, lookalike hosts in regexes), data that leaves the browser, and whether the privacy policy and store disclosures cover what is stored.
3. **Correctness and test quality**: edge cases of the new logic (boundaries, time zones, malformed and huge input, errors, stale state in hooks). Tests assert behaviour and edge cases, not only coverage. The subagent runs `bun run test`.
4. **Changelog and scope**: each changelog bullet maps to the diff and every user-visible change is covered (see the `changelog` skill for its rules). Leftover debug code, unrelated changes, dead code, and violations of `CLAUDE.md` such as other UI or icon libraries.

## 3. Verify

A finding rated blocker or major is a claim until the auditor has reproduced it: read the cited lines, or run the input through the code. Downgrade or drop what doesn't reproduce. Keep subagents' "checked and fine" lines as stated coverage, and mark them as unverified.

## 4. Report

Reply in chat, with no files written and no PR comments posted. Order:

1. **Verdict**: `ship`, `ship with fixes` or `block`. Any reproduced blocker means `block`.
2. **Findings** as a table, most severe first: severity, lens, `file:line`, one-line scenario.
3. **Coverage**: per lens, what was checked and found fine.
4. **Gaps**: what no lens covered, including the manual visual check.
