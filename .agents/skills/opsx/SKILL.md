---
name: opsx
description: OpenSpec workflow driver for this repository. Use when the user asks to run opsx or OpenSpec workflows such as opsx:explore, opsx:propose, opsx:new, opsx:continue, opsx:apply, opsx:verify, opsx:archive, opsx:bulk-archive, opsx:sync, opsx:ff, or opsx:onboard; also use when the user asks to create, continue, implement, verify, sync, or archive OpenSpec changes.
---

# OPSX

## Overview

Drive OpenSpec workflows for this repository using the existing `openspec` CLI and the migrated OPSX command references.

This skill replaces the deprecated `~/.codex/prompts/opsx-*.md` custom prompts with a project-level skill. Treat user inputs like `opsx:explore ...` as natural-language aliases for this skill, even when they are not Codex slash commands.

## Dispatch

Read only the reference file for the requested action:

- `opsx:explore ...` or `$opsx explore ...`: read `references/opsx-explore.md`.
- `opsx:propose ...` or `$opsx propose ...`: read `references/opsx-propose.md`.
- `opsx:new ...` or `$opsx new ...`: read `references/opsx-new.md`.
- `opsx:continue ...` or `$opsx continue ...`: read `references/opsx-continue.md`.
- `opsx:apply ...` or `$opsx apply ...`: read `references/opsx-apply.md`.
- `opsx:verify ...` or `$opsx verify ...`: read `references/opsx-verify.md`.
- `opsx:archive ...` or `$opsx archive ...`: read `references/opsx-archive.md`.
- `opsx:bulk-archive ...` or `$opsx bulk-archive ...`: read `references/opsx-bulk-archive.md`.
- `opsx:sync ...` or `$opsx sync ...`: read `references/opsx-sync.md`.
- `opsx:ff ...` or `$opsx ff ...`: read `references/opsx-ff.md`.
- `opsx:onboard ...` or `$opsx onboard ...`: read `references/opsx-onboard.md`.

If the action is omitted, infer it from the user's wording when clear. If the action remains ambiguous, list the available actions and ask which one to use.

## Project Checks

Before running an action, confirm the repository has OpenSpec initialized:

```bash
npx openspec list --json
```

Use `npx openspec ...` in this project unless a reference explicitly requires another command. The current schema is defined by `openspec/config.yaml`.

## Compatibility Notes

- The old custom prompts describe commands such as `/opsx:explore`. In Codex, use this skill with `opsx:explore ...` or `$opsx explore ...`; do not rely on `/opsx:...` being a registered slash command.
- If a reference mentions `AskUserQuestion`, ask the user directly in normal chat when clarification is required.
- If a reference mentions `TodoWrite`, use the available task planning mechanism only when it exists; otherwise keep progress in concise commentary.
- Do not implement code in `explore` mode. Reading files and creating or updating OpenSpec artifacts is allowed when the user asks.

## Validation

After changing OpenSpec artifacts, run:

```bash
npx openspec validate --all
```
