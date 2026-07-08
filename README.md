# vim-mud-trainer

MUD-based Vim survival game and trainer.

Learn Vim survival commands by escaping a cursed MUD-style text dungeon. The point is not to become a modal-editing monk. The point is to stop panic-typing `quit`, `score`, `l`, and `apua vittu!11` into the wrong parser.

## Concept

`vim-mud-trainer` teaches terminal/editor survival through **Parser Clash**: the player must learn which parser is currently listening.

The game has two layers:

- MUD world: room descriptions, NPC tells, goblin pressure, panic flavor
- Vim buffer trap: normal / insert / command modes, command buffer, text buffer

The trainer does not emulate full Vim. It tracks only survival-level keydown events.

## Current MVP

The current version is a Vite + React keydown trainer:

- terminal-looking UI
- focusable terminal panel
- keydown-driven Vim state machine
- mode state: `NORMAL`, `INSERT`, `COMMAND`
- panic meter for wrong-parser input
- text buffer for insert mode
- command buffer for `:` commands
- XP and room progression

## Survival keys

```text
i       enter insert mode
Escape  leave insert mode
:       enter command mode
:w      save
:q!     quit without saving
:wq     save and quit
:qa!    quit all by force
dd      delete current line
u       undo
```

## Current rooms

```text
The Wrong Parser Inn:
  escape with :q!

The Gate of Insert:
  enter insert mode with i

The Swamp of Accidental Text:
  leave insert mode with Escape

The Goblin Line Cave:
  delete line with dd

The Regret Chamber:
  undo with u

The Save Shrine:
  save with :w

The Exit Portal:
  save and quit with :wq

The Ghost of :qa!:
  quit all by force with :qa!
```

## Design notes

See:

```text
docs/design.md
```

## Development

```bash
npm install
npm run dev
```

Click the terminal panel before using keys. Browsers insist on focus because even fake Vim dungeons must obey paperwork.

## Build

```bash
npm run build
```

## License

MIT, unless a cursed editor steals it first.
