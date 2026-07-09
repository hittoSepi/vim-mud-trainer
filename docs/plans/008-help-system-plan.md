# Help system plan

## Purpose

The game needs a help system that feels like a MUD, but also supports Vim-style help through `:h`.

BatMUD-style help output is a good model: text-first, categorized, dense enough to feel old, but structured enough that the player can actually survive. A shocking concept, apparently.

## Core idea

Support two help entry points:

```text
help
:h
```

They can show the same help system through different parser layers:

- `help` works in the MUD parser.
- `:h` works in Vim COMMAND mode.
- `?` remains emergency room-specific help in editor NORMAL / panic recovery.

This keeps parser identity meaningful without punishing the player for using the obvious word `help` while in the MUD layer.

## Help command roles

```text
help        general MUD help index
:h          Vim-style help index / same system through command mode
?           emergency current-room hint
help topics list all help topics
help <x>    open a topic
:h <x>      open a topic through command mode
```

Examples:

```text
> help
BatVim Help System
================================================================

For a list of all help topics type: 'help topics'
Type 'help getting started' for a good introduction, or
just 'help quickstart' for a brief version.
```

Vim command mode variant:

```text
:h
BatVim Help System
================================================================

You opened help through command mode.
Civilization limps forward.
```

## Suggested top-level help output

```text
BatVim Help System
================================================================

For a list of all help topics type: 'help topics'
Type 'help getting started' for a good introduction, or
just 'help quickstart' for a brief version.

Basic commands:
---------------
Movement:       n, s, e, w, u, d, exits, look, map

Information:    help, score, sc, i, eq, scan, check, tasks

Character:      title, desc, register

Communication:  say, tell, whisper, emote

Handling:       get, drop, keep, search, open

Combat:         wield, attack, kill, stop, parry, check

Skills+Spells:  cast, show spells, show skills, help spell <name>

Vim Survival:   i, Escape, :, :w, :q!, :wq, :qa!, dd, u, :h

Control:        prompt, history, brief

Miscellaneous:  save, quit, typo, idea, bug
```

Do not implement every listed command immediately. The help system can include future categories, but commands that do nothing should either be omitted or clearly marked as unavailable. Nothing says quality like a help page lying to your face.

## Topic examples

### help quickstart

```text
You are in a MUD where the parser keeps changing.

If the prompt ends with >, you are usually in the MUD parser.
If you see -- INSERT --, text belongs there.
If you see :, you are entering a Vim command.

Useful survival commands:
  i       enter writing mode
  Escape  leave writing mode
  :w      save / ward
  :q!     flee without saving pride
  :wq     save and exit
  ?       emergency room hint
```

### help parser

```text
The dungeon has multiple listeners.

MUD parser listens for commands like:
  look, score, help, check, cast

Vim NORMAL listens for survival keys like:
  i, :, dd, u, ?

Vim COMMAND listens for commands after colon:
  :w, :q!, :wq, :qa!, :h

Typing the right command into the wrong parser raises panic.
This is not a bug. This is the entire problem.
```

### help cast

```text
Spells are Vim commands with delusions of grandeur.

Example:
  cast :w at monster

The spell starts chanting and resolves on heartbeat rounds.
Typos fumble the cast.
Focus pays the cost.
Runes unlock symbols.
Scrolls teach recipes.
```

### help runes

```text
Runes teach command symbols and keys.
Scrolls teach recipes.

The Command Rune (:) lets you understand command rituals.
The Write Rune (w) helps form :w.
The Scroll of Ward of Write teaches the full spell.

You still type real Vim commands.
No fake spell punctuation. The keyboard is haunted enough.
```

### help check

```text
Use check to inspect condition without seeing raw numbers.

Examples:
  check ape
  check monster
  check self

Output:
  An Ape is slightly damaged.
```

## Data model

Use topic data, not switch-case scripture.

```ts
type HelpTopic = {
  id: string;
  aliases: string[];
  title: string;
  lines: string[];
  visibleInIndex: boolean;
};
```

Possible file:

```text
src/engine/helpTopics.ts
```

Lookup:

```ts
function getHelpTopic(query: string): HelpTopic | undefined
```

Render:

```ts
function renderHelpTopic(topic: HelpTopic): string[]
```

## Parser integration

MUD parser:

```text
help
help topics
help quickstart
help cast
```

Vim COMMAND parser:

```text
:h
:h topics
:h quickstart
:h cast
```

Emergency help:

```text
?
```

Emergency help is deliberately smaller and context-specific. It should not dump the whole manual while the player is on fire.

## MVP slice

First implementation should include only:

- `help`
- `help topics`
- `help quickstart`
- `:h`
- `:h quickstart`
- existing `?` room hint stays separate

Topics:

- quickstart
- parser
- vim survival
- cast
- check
- runes

Do not wire fifty categories before the MUD parser exists. That is how help systems become museums for features that never shipped.
