# vim-mud-trainer design notes

## Core idea

`vim-mud-trainer` should not become a full Vim terminal emulator. That is how a joke project turns into a cursed research grant.

The game is becoming a **MUD-first terminal survival game** where Vim is one of the dangerous parser layers inside the world.

The game should teach **Vim survival**, not expert modal editing. The core pain point is not `hjkl`. The core pain point is panic caused by the user not knowing which parser is currently listening:

- MUD command parser
- combat parser
- editor normal mode
- editor insert mode
- editor command line
- git commit editor
- lock / loot / spell parser

This is the **Parser Clash**.

The MUD is the world. Vim is the trap, magic system, lockpicking ritual, and occasional cursed interface.

## Visual direction

The game should feel like a retro MUD client / old terminal session, not a modern web app.

Hard UI rule:

```text
NO EXTERNAL UI.
JUST TERMINAL SCREEN.
NO MOUSE-FIRST UI.
NO FANCY GRAPHICS.
JUST TEXT, ANSI COLOUR, MAPS, PROMPTS, AND PANIC.
```

The player should see a black terminal-like screen with coloured MUD text, ASCII maps, room descriptions, combat messages, and a bottom prompt.

Do not put the prompt at the top. Prompt belongs at the bottom, where MUD veterans expect it. Civilization may be collapsing, but this line we hold.

Panic should be visualized through the screen itself, not through a friendly progress widget. When the player panics, the screen border opacity increases. As panic rises, the border should pulse more intensely and the screen may gain red tint, noise, hostile terminal texture, or NPC mockery.

## MUD-first direction

The project should lean into being a small absurd MUD where editor survival is part of the world.

Good direction:

```text
A small weird MUD where the real monster is the wrong parser.
```

Less good direction:

```text
A Vim trainer with a little room flavour glued to it.
```

The player should be able to care about:

- rooms
- exits
- monsters
- combat timing
- gear
- gold
- score
- inventory
- weird NPCs
- cursed Vim/editor traps

Vim should remain important, but it should appear as survival magic and parser pressure inside the MUD rather than swallowing the whole game.

## Bottom prompt

The bottom prompt is sacred.

Suggested default prompt:

```text
[00:42] panic:12 $:37 hp:10/10 sp:8/10 >
```

Possible fields:

```text
[<played_hours>:<played_minutes>] panic:<cur_panic> $:<gold> hp:<cur_hp>/<max_hp> sp:<cur_sp>/<max_sp> >
```

Prompt rules:

- Prompt stays at the bottom.
- Prompt shows current parser pressure and survival stats.
- Prompt should eventually be customizable.
- Prompt should not become a modern HUD widget.
- Prompt is also where command entry visually belongs.

Mode examples:

```text
[00:42] panic:12 $:37 hp:10/10 sp:8/10 >
[00:42] panic:12 $:37 hp:10/10 sp:8/10 -- INSERT --
[00:42] panic:12 $:37 hp:10/10 sp:8/10 :wq
```

## ANSI colour direction

Use restrained MUD-like ANSI colours, not modern UI gradients everywhere.

Suggested semantic colours:

- green: general MUD text, safe room text
- bright green: prompt and successful actions
- cyan: exits, location metadata, parser/system lines
- yellow: items, gold, useful objects
- red: aggressive monsters, damage, critical panic
- magenta: strange/normal monsters, cursed editor magic
- white / dull white: long room descriptions
- grey: separators, old text, secondary flavour

Colours should mean something. Do not decorate every noun like a casino terminal having a seizure.

## UI layout

The screen remains one terminal. Inside that terminal, text can still have structure.

Preferred structure:

```text
<scrolling MUD output>

<ASCII map>        Loc: The Wrong Parser Inn
                   Exits: n, e, panic, :q!

Room description...
NPC tells...
Combat messages...
Editor trap messages...

[00:42] panic:12 $:37 hp:10/10 sp:8/10 >
```

No sidebar. No persistent cheat panel. No mouse-based buttons.

## ASCII world map

A small MUD-style ASCII map may appear inside the terminal screen.

The map should look more like a MUD room/minimap than a modern progress bar.

Example:

```text
<---------------->
| ..#....#...... |
| .@....g....... |
| ..###.....E... |
| ......$....... |
<---------------->
```

Legend ideas:

```text
@ player
# wall / blocked parser
. walkable room flavour
g goblin / monster / hostile syntax
E editor trap / exit / portal
$ loot / shop / gold source
```

Initial implementation may remain progress-only, but the target look should be MUD-like.

Later, Vim-style movement can become its own lesson, but map movement should not quietly hijack the survival trainer.

## Character score

The game should support a `score` command in the MUD parser layer.

The score screen should evoke old MUD character sheets without copying any one source exactly.

Example spirit:

```text
Name: Sepi Rauskunen the overworked, underpaid meany.
---------------------------------------------------------------------
Level: 7 Parser Survivor              Experience: 200620
Money: 2833.60                        Bank: 239086.50
Explore count: 14809/17165 (E%: 86)   Special explore count: 68
Rooms left before next E%: 124         Task Points: 338

  Hit Points     Spell Points     Endurance Points
   1060/1060       245/245            377/377

Str: Mediocre (70-)        Dex: Average (65)       Con: Average (76-)
Int: Impressive (161++)    Wis: Good (67)
Cha: Average (56)          Siz: Average (55)

You have better than average ability in avoiding hits.
You are morally bankrupt.
You have completed 31 active quests. (19 lq, 1 gq, 10 aq, 0 pq, 1 aw)
You feel hungry, thirsty, ancient and brave.
Sepi leads the coder race.
```

Game-flavoured stats can map into mechanics:

- HP: damage tolerance in combat
- SP: Vim spell / parser magic resource
- EP: endurance for timed pressure / panic resistance
- gold: shop, gear, bribes, absurd MUD economy
- experience: lesson and combat progression
- explore count: rooms discovered / cleared
- task points: tutorial/combat achievements

## Gear and gold

Gear should exist, but stay small and lesson-driven.

Possible gear:

- Rusty Escape Key: lowers panic from failed parser input
- Colon Wand: improves command-mode spells
- Insert Cloak: reduces INSERT-mode panic bleed
- Delete Axe: strengthens `dd` / `dw` combat actions
- Undo Charm: one panic failure recovery bonus
- Regex Lantern: reveals hidden parser traps later

Gold can be used for:

- buying gear from NPC merchants
- repairing broken terminal equipment
- paying ridiculous MUD fees
- bribes to parser goblins

NPC merchant idea:

```text
A suspicious terminal merchant says: "I sell shortcuts, none of them ethical."
```

Keep economy tiny. The goal is flavour and motivation, not spreadsheet necromancy.

## Combat direction

Combat should be MUD-like, heartbeat-driven, and parser-aware.

Combat should not become raw button mashing. It should reward calm command entry under timed pressure.

### Heartbeat and tick

MUD-inspired timing:

```text
Heartbeat: every 3 seconds
Tick: every 30 seconds / 10 heartbeats
```

Heartbeat:

- enemies attack
- combat rounds resolve
- warnings appear
- parser pressure increases if player hesitates or types wrong input

Tick:

- environment updates
- panic may decay slightly
- resources may regenerate slightly
- monsters may change stance
- shop/rest/room effects may apply

MUD veterans know timing matters. The game can teach this without becoming latency worship. Entering combat right after a heartbeat can give the player the cleanest first action window.

### Combat parser layers

Combat can have modes, but they should be few and readable:

- `melee` parser: basic attacks, defensive actions, gear use
- `spell` / Vim magic parser: Vim-inspired spells and editor commands
- `normal` / editor trap parser: when combat forces the player into Vim survival

Vim remains useful through combat magic:

- `dd`: delete hostile line / heavy slash
- `dw`: delete word / precision strike
- `u`: undo a bad hit or recover a mistake
- `:w`: ward / save stance / stabilize room
- `:q!`: emergency flee without saving pride
- `:wq`: finish ritual / save-and-exit trap
- `:qa!`: late-game room wipe / forced quit-all blast

Do not implement full Vim movement early. Add commands only when the lesson needs them.

### Example encounter: Syntax Error Swarm

```text
A Syntax Error crawls out of the line noise.
Syntax Error prepares to strike on the next heartbeat.
```

Mechanic:

- Enemy has small HP represented by bad words / corrupt tokens.
- Enemy attacks every heartbeat.
- Player uses calm survival commands to remove pieces.
- Wrong parser inputs increase panic and may cost HP.

Example actions:

```text
dd      delete hostile line / big hit
u       undo panic damage / defensive recovery
:w      stabilize the fight / ward
:q!     flee encounter
```

Later lessons can introduce:

```text
dw      delete word / precise strike
w       move to next word / targeting
```

But only when the combat lesson is explicitly about that. No accidental hjkl monastery.

## Vim as magic / locks / loot

Vim can be used as a world interaction system.

Examples:

- locked door requires command-mode ritual `:wq`
- cursed chest requires entering INSERT, typing an inscription, Escape, then `:w`
- loot chest has corrupt text that must be cleaned with `dd` or later `dw`
- ancient terminal shrine teaches `:qa!`
- Git Commit Abyss uses commit-message editing as a puzzle

This keeps Vim meaningful without making every second of the game an editor panic simulator. Which is good, because players are technically mammals.

## Emergency help

The game may include a small emergency help command for stuck players.

Rules:

- `?` in NORMAL mode shows a room-specific hint.
- When panic is high, the terminal may reveal that `?` exists.
- During panic failure, `?` should still work.
- Help should feel like a reluctant MUD hint, not like modern onboarding.
- Help must not become a persistent cheat panel.

Example:

```text
The dungeon notices the flailing. Press ? for emergency help.
?> emergency help opens reluctantly.
Hint: press :, type q!, then press Enter.
```

## State machine

Do not emulate Vim. Track only keydown events relevant to survival commands and MUD parser commands.

Initial editor modes:

```ts
type VimMode = 'normal' | 'insert' | 'command';
```

Likely broader game state later:

```ts
type ParserLayer = 'mud' | 'melee' | 'spell' | 'normal' | 'insert' | 'command';
```

State should eventually track:

- parser layer
- mode
- command buffer
- text buffer
- panic
- HP / SP / EP
- gold
- XP
- gear
- room
- combat state
- heartbeat counter
- tick counter

### NORMAL

Listens for a small command vocabulary:

- `i` enters INSERT
- `:` enters COMMAND
- `u` triggers undo
- `d` starts delete intent, with `dd` as delete line
- `/` enters search/command-like mode
- `?` shows emergency help

Everything else increases panic while in editor NORMAL mode.

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
- `qa!`

The command executes on Enter. Escape cancels command mode.

## MVP controls

Required first survival controls:

```text
i       enter insert mode
Escape  leave insert mode / recover panic failure
?       emergency room hint
:       enter command mode
:w      save / ward
:q!     quit without saving / flee
:wq     save and quit / finish ritual
:qa!    quit all by force
dd      delete current line / heavy strike
u       undo / recover
score   show character score in MUD parser layer
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

### The Syntax Error Swarm

First combat room.

Enemy attacks on heartbeat.

Correct player actions could include:

```text
dd
u
:w
:q!
```

The room teaches that command timing matters and wrong parser input hurts.

### The Locked Diff Door

A locked door contains hostile text.

Correct interaction:

```text
i
write inscription
Escape
:wq
```

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

Use a keydown-driven reducer for editor survival and a small command parser for MUD commands.

Current important files:

```text
src/engine/vimMachine.ts
src/engine/rooms.ts
src/App.tsx
src/styles.css
docs/design.md
```

Likely next files later:

```text
src/engine/player.ts
src/engine/combat.ts
src/engine/items.ts
src/engine/worldMap.ts
src/engine/prompt.ts
```

React should listen to `keydown` on the terminal screen. Avoid ordinary form inputs and avoid mouse-first UI.

Lesson data should describe:

- starting parser layer
- starting mode
- accepted transitions
- success condition
- wrong parser responses
- panic thresholds
- room flavour text
- combat state, when relevant
- rewards, when relevant

## Non-goals

Do not implement:

- full Vim movement early
- real buffers
- exact Ex command parsing
- plugins
- syntax highlighting
- actual terminal emulation
- modern dashboard chrome
- mouse-first controls
- decorative UI panels
- mouse-driven maps
- large economy simulation
- full MUD networking

The game is about MUD survival, parser awareness, and editor panic. If it becomes a Vim clone, the dungeon has won. If it becomes a full MMO, the goblin has become product manager.
