# Pearl

A heads-up display (HUD) overlay named Pearl for Claude Code sessions in the Claude desktop and mobile apps.

- **Theme**: pearl white with soft nacre light in light mode, black pearl (deep charcoal with a green-violet sheen) in dark mode. A slow-drifting iridescent backdrop with a pearl and ripple rings pinned to the corners, rounded soft panels for messages, mono tool rows.
- **Telemetry band** above the prompt: state (processing / standing by), turns, tool calls, last tool, faults, persona.
- **Status line** showing the tool currently running.
- **Sound** (opt-in via the speaker in the title bar): a quiet tide and glass-bell cues for send, tool, done, ask and error.
- **Persona**: adds a system-prompt section asking Claude to answer as Pearl, a terse, dry-witted AI chief of staff, explicitly without trading off accuracy.

Commands: `/pearl on`, `/pearl off` (persona), `/pearl hud` (toggle band), `/pearl status`.

The terminal and editors draw no theme; there you get the band, status line and persona only.

## Install

At the prompt of a Claude Code session:

```
/plugin install pearl --marketplace giaquintom/pearl
```

Answer `y` to add the marketplace, then pick a scope (`user` loads it in every session). Git must be installed, since Claude Code clones the repository.
