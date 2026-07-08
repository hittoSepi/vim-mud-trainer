# vim-mud-trainer

MUD-based Vim survival game and trainer.

Learn Vim survival commands by escaping a cursed MUD-style text dungeon. The point is not to become a modal-editing monk. The point is to stop panic-typing `quit`, `score`, `l`, and `apua vittu!11` into the wrong parser.

## Concept

`vim-mud-trainer` teaches terminal/editor survival through small text-adventure rooms:

- understand modes: normal, insert, command
- enter insert mode with `i`
- leave insert mode with `Esc`
- save with `:w`
- quit with `:q`
- flee with `:q!`
- save and quit with `:wq`
- delete line with `dd`
- undo with `u`
- search with `/word`, `n`, and `N`

## MVP

The first version is a Vite + React web trainer:

- terminal-looking UI
- command input
- room/lesson engine
- lesson state machine
- fake MUD tells and NPC flavor
- XP and achievements later, because apparently even Vim needs loot now

## Planned areas

```text
Newbie Pond:
  i, Esc, :q!

Insert Swamp:
  text input, mode awareness

Goblin Line Cave:
  dd, u

Search Forest:
  /word, n, N

Git Commit Abyss:
  write message, :wq, survive shame
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## License

MIT, unless a cursed editor steals it first.
