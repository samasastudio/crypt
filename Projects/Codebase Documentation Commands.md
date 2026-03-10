# Codebase Documentation Commands

This note lists the PowerShell commands agents can run from each codebase root to reach the shared documentation stored in this vault at `C:\Users\Owner\projects\crypt`.

These commands assume the codebase lives as a sibling of `crypt` inside `C:\Users\Owner\projects`.

## Basilisk AV

- Codebase root: `C:\Users\Owner\projects\basilisk-av`
- Shared vault docs: `C:\Users\Owner\projects\crypt\Projects\Basilisk AV`
- Commands to run from `C:\Users\Owner\projects\basilisk-av`:

```powershell
Resolve-Path "..\crypt\Projects\Basilisk AV"
Get-ChildItem "..\crypt\Projects\Basilisk AV"
Set-Location "..\crypt\Projects\Basilisk AV"
```

- Suggested `AGENTS.md` pointer:

```text
Shared documentation for this project lives in the sibling vault at `..\crypt\Projects\Basilisk AV` from the repo root.
```

## Basilisk SH

- Codebase root: `C:\Users\Owner\projects\basilisk-sh`
- Shared vault docs: `C:\Users\Owner\projects\crypt\Projects\Basilisk SH\docs`
- Commands to run from `C:\Users\Owner\projects\basilisk-sh`:

```powershell
Resolve-Path "..\crypt\Projects\Basilisk SH\docs"
Get-ChildItem "..\crypt\Projects\Basilisk SH\docs"
Get-Content "..\crypt\Projects\Basilisk SH\docs\README.md"
Set-Location "..\crypt\Projects\Basilisk SH\docs"
```

- Suggested `AGENTS.md` pointer:

```text
Shared documentation for this project lives in the sibling vault at `..\crypt\Projects\Basilisk SH\docs` from the repo root.
```

## Design System

- Shared vault docs: `C:\Users\Owner\projects\crypt\Projects\Design System`
- As of March 10, 2026, no sibling codebase directory for this project was found under `C:\Users\Owner\projects`, so only the absolute-path version can be documented right now.

```powershell
Resolve-Path "C:\Users\Owner\projects\crypt\Projects\Design System"
Get-ChildItem "C:\Users\Owner\projects\crypt\Projects\Design System"
Set-Location "C:\Users\Owner\projects\crypt\Projects\Design System"
```

## Reusable Pattern

If a future project repo also lives directly under `C:\Users\Owner\projects`, agents can usually reach its shared vault docs with:

```powershell
Resolve-Path "..\crypt\Projects\<Project Name>"
```

If that project keeps its notes in a nested `docs` folder inside the vault, use:

```powershell
Resolve-Path "..\crypt\Projects\<Project Name>\docs"
```
