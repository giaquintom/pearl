# Pearl

A heads-up display (HUD) overlay named Pearl for Claude Code sessions in the Claude desktop and mobile apps.

- **Theme**: dark arc-reactor palette, an animated HUD backdrop (slow-turning reticles pinned to the corners, faint grid, scan sweep), bracketed glass panels for replies, mono headings and tool rows.
- **Telemetry band** above the prompt: state (processing / standing by), turns, tool calls, last tool, faults, persona.
- **Status line** showing the tool currently running.
- **Sound** (opt-in via the speaker in the title bar): low reactor hum and short cues for send, tool, done, ask and error.
- **Persona**: adds a system-prompt section asking Claude to answer as Pearl, a terse, dry-witted AI chief of staff, explicitly without trading off accuracy.

Commands: `/pearl on`, `/pearl off` (persona), `/pearl hud` (toggle band), `/pearl status`.

The terminal and editors draw no theme; there you get the band, status line and persona only.

## Install

At the prompt of a Claude Code session:

```
/plugin install pearl --marketplace giaquintom/pearl
```

Answer `y` to add the marketplace, then pick a scope. This repository is private, so your machine needs GitHub access to it (`gh auth login` or git credentials).
