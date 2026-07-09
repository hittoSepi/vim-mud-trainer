# Heartbeat spellcasting plan

## Purpose

Combat spells should not resolve instantly. They should feel like MUD casting: a command starts a chant, the spell advances on heartbeat rounds, and then succeeds or fails when the cast time reaches zero.

This keeps the player engaged with timing instead of turning Vim commands into instant arcade buttons. Heaven forbid the keyboard be straightforward.

## Core rule

The player still types real Vim commands.

The game may describe those commands as spells, but the input must remain the real command:

```text
cast :w at monster
```

The spell effect is MUD flavour. The learned command is Vim.

## Spell metadata

Each spell/skill should define:

```ts
type Spell = {
  id: string;
  name: string;
  vimCommand: string;
  castTimeHb: number;
  manaCost: number;
  target: 'enemy' | 'self' | 'room' | 'exit';
  effect: SpellEffect;
  failureText: string[];
};
```

Example:

```ts
const wardOfWrite = {
  id: 'ward-of-write',
  name: 'Ward of Write',
  vimCommand: ':w',
  castTimeHb: 3,
  manaCost: 2,
  target: 'enemy',
};
```

## Casting flow

Input:

```text
prompt > cast :w at monster
```

Immediate output:

```text
You start chanting.
Ward of Write: ####
```

Heartbeat 1:

```text
****************** Round Change *********************
Ward of Write: ###
The Syntax Goblin scrapes at your prompt.
```

Heartbeat 2:

```text
****************** Round Change *********************
Ward of Write: ##
Your hands remember the colon key, unfortunately.
```

Heartbeat 3:

```text
****************** Round Change *********************
You haste.
Ward of Write: #
The monster prepares to interrupt.
```

Resolve:

```text
****************** Round Change *********************
You chant ':w' and boom! Ward of Write hits the monster hard.
Syntax Goblin takes 9 damage.
```

## Damage text bands

Use different flavour based on effect strength.

Low damage:

```text
Ward of Write flickers and scratches the monster.
Syntax Goblin takes 2 damage.
```

Medium damage:

```text
Ward of Write slams into the monster.
Syntax Goblin takes 6 damage.
```

High damage:

```text
You chant ':w' and boom! Ward of Write hits the monster hard.
Syntax Goblin takes 12 damage.
```

Critical:

```text
Ward of Write detonates in a clean green flash.
Syntax Goblin is written out of local reality.
```

## Failure flow

Wrong command:

```text
prompt > cast :w1 at monster
```

Output:

```text
You chant ':w1' and fail miserably.
The parser coughs blood-coloured lint.
Panic rises.
```

Possible failure causes:

- unknown Vim command
- typo in command
- not enough SP / mana
- wrong target
- interrupted by enemy heartbeat
- wrong parser layer

Failure should teach exact input. It should not introduce fake spell words.

Good correction:

```text
The spellbook whispers: Ward of Write uses :w.
```

Bad correction:

```text
Use !($*) instead.
```

Do not do the second one unless the project has fully given up and become punctuation witchcraft.

## Rune learning

Runes can be used as the fiction for learning spells, but they should not become extra input syntax.

Good:

```text
You find the Write Rune.
New spell learned: Ward of Write (:w)
```

Bad:

```text
You find the Write Rune.
Type #^!~ to cast Ward of Write.
```

Rune rule:

- Runes unlock real Vim commands as spells.
- Runes may explain command meaning.
- Runes may appear on doors, loot chests, shrines, or monster corpses.
- Runes must not replace the real command.

Example rune:

```text
The rune is shaped like a colon followed by a small w.
It hums with the awful promise of persistence.

New spell learned:
Ward of Write     :w
```

## One spell at a time

Early game should teach one spell/skill at a time.

Do not hand the player a spellbook full of commands at once. That is how manuals happen.

Suggested order:

1. `i` / `Escape`: registration paperwork, writing mode
2. `:w`: Ward of Write, first stabilizing spell
3. `dd`: Line Rend, first combat strike
4. `u`: Undo Wound, recovery
5. `:q!`: Coward's Gate, flee
6. `:wq`: Seal and Depart, complete ritual
7. `:qa!`: Final Eviction, late emergency wipe

## Combat state

A minimal active cast can be tracked as:

```ts
type ActiveCast = {
  spellId: string;
  command: string;
  targetId: string;
  remainingHb: number;
  totalHb: number;
};
```

Each heartbeat:

- decrement `remainingHb`
- print round change
- print cast progress bar
- run enemy action
- resolve spell if `remainingHb <= 0`

Progress display:

```text
Ward of Write: ####
Ward of Write: ###
Ward of Write: ##
Ward of Write: #
```

## UI notes

Casting output is normal MUD text in the scrollback.

Prompt remains at the bottom:

```text
[00:42] panic:12 $:37 hp:10/10 sp:8/10 >
```

While casting, the prompt can optionally show:

```text
[00:42] panic:12 $:37 hp:10/10 sp:6/10 casting:Ward of Write(##) >
```

Keep this optional. The scrollback already shows the cast.

## MVP slice

First implementation should contain only one casted spell:

```text
Ward of Write     :w
cast time: 3 heartbeat
mana cost: 2 SP
```

One enemy:

```text
Syntax Goblin
hp: 12
attack: +panic or -hp every heartbeat
```

One command:

```text
cast :w at monster
```

One failure:

```text
cast :w1 at monster
```

This is enough to prove the model without summoning the spreadsheet demon.
