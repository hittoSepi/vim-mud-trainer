# vim-mud-trainer design notes

## Core idea

`vim-mud-trainer` should not become a full Vim terminal emulator. That is how a joke project turns into a cursed research grant.

The game should teach **Vim survival**, not expert modal editing. The core pain point is not `hjkl`. The core pain point is panic caused by the user not knowing which parser is currently listening:

- shell
- MUD command parser
- editor normal mode
- editor insert mode
- editor command line
- git commit editor

This is the **Parser Clash**.

## UI layers

The UI should present two layers:

1. **MUD world**
   - room descriptions
   - NPC tells
   - enemy pressure
   - lore and jokes
   - panic consequences

2. **Vim buffer / editor trap**
   - visible modal editor area
   - current mode indicator
   - command buffer
   - text buffer
   - panic meter

The player should feel that they are inside a MUD room, but temporarily trapped inside an editor-like interface.

## State machine

Do not emulate Vim. Track only keydown events relevant to survival commands.

```ts
type VimMode = 'normal' | 'insert' | 'command';

type VimMachineState = {
  mode: VimMode;
  commandBuffer: string;
  textBuffer: string;
  panic: number;
  message: string;
};
```

### NORMAL

Listens for a small command vocabulary:

- `i` enters INSERT
- `:` enters COMMAND
- `u` triggers undo
- `d` starts delete intent, with `dd` as delete line
- `/` enters search/command-like mode

Everything else increases panic.

Example wrong input:

```text
l
score
quit
apua vittu!11
```

This should not be treated as normal text. It should raise panic and produce Wrong Parser feedback.

### INSERT

Allows free text input.

- normal printable keys append to text buffer
- Escape returns to NORMAL

This mode should teach the player that insert mode is where text belongs. Normal mode is not a chat box. Cruel but apparently necessary.

### COMMAND

Activated by `:` in NORMAL mode.

The command buffer accepts:

- `w`
- `q`
- `q!`
- `wq`
- later: `qa!`

The command executes on Enter. Escape cancels command mode.

## Panic meter

Wrong parser inputs increase panic.

Potential effects:

- mild: flavor text warnings
- medium: NPC mocks player
- high: screen noise / red tint / text wall approaches
- max: lesson reset or comic failure state

The panic meter should reinforce that wrong mode awareness is the danger.

## MVP controls

Required first survival controls:

```text
i       enter insert mode
Escape  leave insert mode
:       enter command mode
:w      save
:q!     quit without saving
:wq     save and quit
dd      delete current line
u       undo
```

## Room ideas

### The Wrong Parser Inn

The player believes they are still in BatMUD and types MUD commands into an editor.

Wrong inputs:

```text
l
score
q
^q
quit
apua vittu!11
```

Correct escape:

```text
:q!
```

### Git Commit Abyss

Git opens an editor for a commit message. The player must:

1. enter insert mode with `i`
2. write a commit message
3. Escape back to normal mode
4. save and quit with `:wq`

Failure theme: they keep typing shell/MUD commands into the commit message.

### The Ghost of :qa!

All buffers are open. The house is burning. Text flames approach from the top of the screen.

Correct answer:

```text
:qa!
```

This teaches forced quit-all as a late-game emergency spell.

### The Caps Lock Curse

A debuff randomly uppercases commands.

Examples:

- `i` becomes `I`
- `u` becomes `U`

In real Vim these can do different things. The game does not need full behavior, just enough to teach that casing matters and panic typing is punished.

## Implementation direction

Replace the current form-submit command model with a keydown-driven reducer.

Suggested files:

```text
src/engine/vimMachine.ts
src/engine/vimReducer.ts
src/engine/rooms.ts
```

React should listen to `keydown` while the terminal panel is focused.

Lesson data should describe:

- starting mode
- accepted transitions
- success condition
- wrong parser responses
- panic thresholds
- room flavor text

## Non-goals

Do not implement:

- full Vim movement
- real buffers
- exact Ex command parsing
- plugins
- syntax highlighting
- actual terminal emulation

The game is about survival and mode awareness. If it becomes a Vim clone, the dungeon has won.
