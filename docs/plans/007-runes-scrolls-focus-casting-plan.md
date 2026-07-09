# Runes, scrolls, focus, and casting plan

## Purpose

This plan ties together:

- heartbeat-based cast time
- fumbles from typos / wrong parser input
- haste from good heartbeat timing
- Focus as the Vim-MUD spell resource
- runes as command-symbol unlocks
- scrolls as recipe / spell knowledge

The goal is to make Vim commands feel like MUD magic without teaching fake input syntax. The player still types real Vim commands. The world explains those commands through runes and scrolls, because apparently even `:w` needed mythology.

## Core rules

```text
Input is always real Vim command syntax.
Runes unlock command symbols / letters.
Scrolls teach recipes / named spells.
Free experimentation can hint, but core spells should be taught by scrolls or authored rooms.
```

This avoids two bad outcomes:

1. player learns fake spell punctuation instead of Vim
2. player randomly discovers important lessons without context

## Focus resource

Use **Focus** instead of Mana for Vim spellcasting.

Prompt field can still be compact:

```text
[00:42] panic:12 $:37 hp:10/10 focus:6/10 >
```

or, if we keep classic MUD short labels:

```text
[00:42] panic:12 $:37 hp:10/10 sp:6/10 >
```

Mechanically:

- Focus powers Vim spells.
- Focus regenerates on Tick, not every heartbeat.
- High panic can slow Focus regeneration.
- Burnout at 0 Focus blocks larger spells and increases risk.

Example:

```text
You are out of Focus.
The command is clear, but your hands are full of bees.
```

## Heartbeat cast time

Each spell defines a cast time in heartbeats.

```ts
type Spell = {
  id: string;
  name: string;
  vimCommand: string;
  requiredRuneIds: string[];
  requiredScrollId?: string;
  castTimeHb: number;
  focusCost: number;
  target: 'enemy' | 'self' | 'room' | 'exit';
};
```

Example:

```ts
const wardOfWrite = {
  id: 'ward-of-write',
  name: 'Ward of Write',
  vimCommand: ':w',
  requiredRuneIds: ['colon-rune', 'write-rune'],
  requiredScrollId: 'scroll-ward-of-write',
  castTimeHb: 3,
  focusCost: 2,
  target: 'enemy',
};
```

## Casting flow

Input:

```text
> cast :w at monster
```

Immediate output:

```text
You start chanting.
Ward of Write: ####
```

Round changes:

```text
****************** Round Change *********************
Ward of Write: ###
The Syntax Goblin scrapes at your prompt.

****************** Round Change *********************
Ward of Write: ##
Your focus tightens around the colon rune.

****************** Round Change *********************
Ward of Write: #
The monster prepares to interrupt.
```

Resolution:

```text
****************** Round Change *********************
You chant ':w' and boom! Ward of Write hits the monster hard.
```

Use combat text bands, not raw damage numbers.

## Fumble rules

A cast can fail immediately if:

- command is mistyped
- command is unknown
- required rune is missing
- required scroll is missing
- player lacks Focus
- player types wrong Vim input during an active cast
- enemy interrupts on heartbeat

Mistyped command:

```text
> cast :w1 at monster
You chant ':w1' and fail miserably.
The parser coughs blood-coloured lint.
The spellbook whispers: Ward of Write uses :w.
```

Missing rune:

```text
You do not understand the ancient force of ':' yet.
The command bends away from your fingers.
```

Missing scroll:

```text
The runes are familiar, but the recipe is not.
You need a scroll before this becomes a spell instead of punctuation panic.
```

Wrong input during active cast:

```text
You lose concentration.
Ward of Write collapses into harmless green syntax.
Panic rises.
```

## Haste / timing bonus

If the player starts a cast soon after round change, they may gain haste.

Example timing rule:

```text
0-1000 ms after round change: Perfect timing, cast time -1 HB
1000-1800 ms: Good timing, no penalty
1800-3000 ms: Late, normal cast but worse fumble risk
```

Output:

```text
You catch the heartbeat cleanly.
You haste.
Ward of Write: ###
```

Do not make this mandatory for early lessons. It should reward veterans, not punish new players for having mammal reflexes.

## Rune model

Runes are command-symbol or key unlocks.

```ts
type Rune = {
  id: string;
  symbol: string;
  name: string;
  description: string;
};
```

Rune examples:

```text
Insert Rune      i
Escape Rune      Escape
Command Rune     :
Write Rune       w
Quit Rune        q
Force Rune       !
Delete Rune      d
Undo Rune        u
Word Rune        w, when used as word motion / target concept
All Rune         a
```

Rune pickup:

```text
You find the Command Rune (:).
The mark opens like a tiny administrative wound.
You can now enter command mode rituals.
```

Important: runes unlock real inputs. They never replace them.

Bad:

```text
Type #!^ to cast Ward of Write.
```

Good:

```text
Ward of Write uses :w.
```

## Scroll model

Scrolls teach recipes: the actual command sequence and its meaning.

```ts
type Scroll = {
  id: string;
  spellId: string;
  title: string;
  teachesCommand: string;
  text: string[];
};
```

Example:

```text
You unroll a brittle scroll.

WARD OF WRITE
The colon opens command ritual.
The w binds the world to disk.

New spell learned:
Ward of Write     :w
```

Scrolls are useful because they make learning explicit and author-controlled. A player may own `:` and `w`, but without the scroll they only understand pieces, not the recipe.

## Free experimentation rule

Allow limited experimentation, but do not make it the main way to learn core spells.

Recommended model:

- If player has all required runes but no scroll, the command can produce a hint.
- The spell should not fully unlock until scroll / authored lesson confirms it.
- Optional/non-core combos can be discovered experimentally later.

Example:

```text
> cast :w at monster
The Command Rune and Write Rune resonate.
You feel this could become a spell, but you lack the scroll.
```

This gives discovery flavour without making the player brute-force Vim combinations like a raccoon with a keyboard.

## One spell / skill at a time

Early progression should unlock one command at a time.

Suggested order:

1. `i` / `Escape`: city registration paperwork
2. `:w`: Ward of Write
3. `dd`: Line Rend
4. `u`: Undo Wound
5. `:q!`: Coward's Gate
6. `:wq`: Seal and Depart
7. `:qa!`: Final Eviction

Each should have:

- authored room
- rune or scroll pickup
- safe first use
- combat / world use later

## Keyboard filtering

Do not hard-block unknown keys too aggressively in early MVP.

Better:

```text
You do not understand this rune yet.
Panic rises.
```

Only hard-block where a lesson requires it. The wrong parser feedback is often more educational than silence.

## MVP slice

First useful implementation:

- Focus exists as renamed SP or alias of SP.
- One rune: Command Rune `:`
- One scroll: Ward of Write `:w`
- One cast spell: Ward of Write
- Cast time: 3 HB
- Focus cost: 2
- Fumble command: `:w1`
- Missing scroll hint if player tries `:w` too early

This proves the model without building an entire occult Vim university.
