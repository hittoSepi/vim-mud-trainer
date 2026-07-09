# Check condition wording plan

## Purpose

Combat should avoid showing raw enemy HP and damage numbers in normal play.

Numbers are useful internally, but MUD output should describe condition in words:

```text
> check ape
An Ape is slightly damaged.
```

This feels more like a MUD and less like a debug overlay that escaped containment.

## Core rule

Keep numeric HP internally.

Show descriptive condition externally.

Good:

```text
The Syntax Goblin is badly hurt.
```

Less good:

```text
Syntax Goblin hp: 3/12
```

The second is fine for debug mode, score sheets, or maybe a special diagnostic spell later. It should not be default combat flavour.

## Command

MUD parser command:

```text
check <target>
```

Examples:

```text
> check ape
An Ape is slightly damaged.

> check goblin
A Syntax Goblin is in bad shape.

> check self
You are somewhat battered and professionally disappointed.
```

Aliases later, if desired:

```text
look <target>
con <target>
consider <target>
```

Keep MVP to `check` unless the parser starts pretending to be a democracy.

## Condition bands

Internally compute health ratio:

```ts
const ratio = currentHp / maxHp;
```

Suggested enemy condition bands:

```text
100%        is in excellent shape.
80-99%      is slightly damaged.
60-79%      is wounded.
40-59%      is badly hurt.
20-39%      is in bad shape.
1-19%       is near death.
0%          is dead.
```

For monsters:

```text
An Ape is in excellent shape.
An Ape is slightly damaged.
An Ape is wounded.
An Ape is badly hurt.
An Ape is in bad shape.
An Ape is near death.
An Ape is dead.
```

For weird parser monsters:

```text
A Syntax Goblin is mostly coherent.
A Syntax Goblin is missing punctuation.
A Syntax Goblin is leaking stack traces.
A Syntax Goblin is badly malformed.
A Syntax Goblin is collapsing into lint.
A Syntax Goblin is one semicolon from death.
A Syntax Goblin has been deleted from the buffer.
```

## Spell result wording

Spell output should describe impact without always printing numeric damage.

Low impact:

```text
Ward of Write flickers against the monster.
The Syntax Goblin flinches.
```

Medium impact:

```text
Ward of Write slams into the monster.
The Syntax Goblin staggers.
```

High impact:

```text
You chant ':w' and boom! Ward of Write hits the monster hard.
The Syntax Goblin is thrown into a pile of malformed braces.
```

Kill:

```text
Ward of Write detonates in a clean green flash.
The Syntax Goblin has been deleted from the buffer.
```

Optional debug/development output can include numbers behind a flag, but normal play should not.

## Prompt interaction

Player HP can remain numeric in the prompt:

```text
[00:42] panic:12 $:37 hp:7/10 sp:6/10 >
```

Enemy condition should be queried or described through combat text.

This creates a good split:

- player survival stats are visible
- enemy state is flavourful and fuzzy
- `check` becomes useful

## MVP implementation idea

Add helper:

```ts
function describeCondition(entity: CombatEntity): string
```

Add parser command:

```text
check <target>
```

Resolve target:

- `self` / `me` / player name
- current monster name
- common aliases like `monster`, `goblin`, `ape`

First MVP can support only:

```text
check monster
check self
```

Then expand later. Because apparently restraint must be manually installed.
