# Combat vocabulary data plan

## Purpose

Combat text should be generated from small vocabularies and templates instead of being hand-written line by line.

This gives the game MUD-like variety without creating a content swamp large enough to qualify as a wetlands restoration project.

## Core idea

Keep combat mechanics numeric internally.

Generate player-facing text from:

- weapon vocabularies
- spell vocabularies
- monster condition vocabularies
- timing feedback phrases
- hit severity bands
- compact templates

Example output:

```text
You CUT Ape with short sword.
Ape claws at your robe.
Ward of Write slams into Syntax Goblin.
Syntax Goblin is leaking stack traces.
```

No default damage numbers.

## Hit severity bands

```ts
type HitSeverity =
  | 'miss'
  | 'graze'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'crit'
  | 'supercrit';
```

Severity is computed from hidden combat numbers, timing quality, weapon/spell, and random roll.

Displayed text is selected from the matching vocabulary band.

## Timing quality bands

```ts
type TimingQuality = 'perfect' | 'good' | 'normal' | 'late';
```

Timing quality can influence hit severity and add optional lead-in text:

```text
You catch the heartbeat cleanly.
You strike just after the heartbeat.
You swing late.
```

## Weapon vocabulary

```ts
type WeaponVocabulary = {
  id: string;
  displayName: string;
  templates: string[];
  verbs: Record<HitSeverity, string[]>;
};
```

Example:

```ts
const shortSwordText: WeaponVocabulary = {
  id: 'short-sword',
  displayName: 'short sword',
  templates: [
    'You {verb} {target} with {weapon}.',
  ],
  verbs: {
    miss: ['miss'],
    graze: ['nick', 'scratch'],
    light: ['stab', 'poke'],
    medium: ['slash', 'cut'],
    heavy: ['CUT', 'DRIVE into'],
    crit: ['MANGLE', 'CARVE'],
    supercrit: ['*SPLIT*', '*RUIN*'],
  },
};
```

Generated output:

```text
You slash Ape with short sword.
You CUT Ape with short sword.
You *SPLIT* Ape with short sword.
```

## Spell vocabulary

```ts
type SpellVocabulary = {
  spellId: string;
  templates: Record<HitSeverity, string[]>;
};
```

Example:

```ts
const lineRendText: SpellVocabulary = {
  spellId: 'line-rend',
  templates: {
    miss: ['Line Rend fails to find a clean line.'],
    graze: ['Line Rend tears at {target}.'],
    light: ['Line Rend bites into {target}.'],
    medium: ['Line Rend rips {target} open.'],
    heavy: ['Line Rend DELETES a chunk of {target}.'],
    crit: ['Line Rend SHREDS {target} into tokens.'],
    supercrit: ['Line Rend *REMOVES* {target} from the buffer.'],
  },
};
```

## Monster condition vocabulary

```ts
type ConditionBand =
  | 'excellent'
  | 'slightlyDamaged'
  | 'wounded'
  | 'badlyHurt'
  | 'badShape'
  | 'nearDeath'
  | 'dead';

type MonsterConditionVocabulary = {
  monsterId: string;
  lines: Record<ConditionBand, string[]>;
};
```

Generic example:

```ts
const apeConditionText = {
  monsterId: 'ape',
  lines: {
    excellent: ['An Ape is in excellent shape.'],
    slightlyDamaged: ['An Ape is slightly damaged.'],
    wounded: ['An Ape is wounded.'],
    badlyHurt: ['An Ape is badly hurt.'],
    badShape: ['An Ape is in bad shape.'],
    nearDeath: ['An Ape is near death.'],
    dead: ['An Ape is dead.'],
  },
};
```

Parser monster example:

```ts
const syntaxGoblinConditionText = {
  monsterId: 'syntax-goblin',
  lines: {
    excellent: ['A Syntax Goblin is mostly coherent.'],
    slightlyDamaged: ['A Syntax Goblin is missing punctuation.'],
    wounded: ['A Syntax Goblin is leaking stack traces.'],
    badlyHurt: ['A Syntax Goblin is badly malformed.'],
    badShape: ['A Syntax Goblin is collapsing into lint.'],
    nearDeath: ['A Syntax Goblin is one semicolon from death.'],
    dead: ['A Syntax Goblin has been deleted from the buffer.'],
  },
};
```

## Enemy attack vocabulary

Enemies should also use vocabulary tables.

```ts
type EnemyAttackVocabulary = {
  monsterId: string;
  templates: Record<HitSeverity, string[]>;
};
```

Example:

```ts
const apeAttackText = {
  monsterId: 'ape',
  templates: {
    miss: ['Ape swings past you.'],
    graze: ['Ape brushes your arm with an ugly paw.'],
    light: ['Ape claws you.'],
    medium: ['Ape pounds your chest.'],
    heavy: ['Ape SMASHES you backward.'],
    crit: ['Ape MAULS you with professional resentment.'],
    supercrit: ['Ape *FOLDS* you like municipal paperwork.'],
  },
};
```

## Template filling

Minimal template variables:

```text
{verb}
{target}
{weapon}
{spell}
{caster}
```

Example:

```ts
renderTemplate('You {verb} {target} with {weapon}.', {
  verb: 'slash',
  target: 'Ape',
  weapon: 'short sword',
});
```

Output:

```text
You slash Ape with short sword.
```

Keep the template system tiny. Do not build a procedural literature engine. The goblin has limits, even if the developer does not.

## Random selection

Use deterministic seeded randomness later if replay/debug matters.

For MVP, simple random choice is enough:

```ts
function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
```

## Authored text budget

Early content target:

- 1 weapon vocabulary
- 1 spell vocabulary
- 2 monster condition vocabularies
- 2 enemy attack vocabularies
- 4 timing feedback lines

This is enough to create variety without spending three days writing monkey injuries.

## Suggested file layout

```text
src/engine/combatText.ts
src/engine/combatTypes.ts
```

Possible later split:

```text
src/data/weapons.ts
src/data/spells.ts
src/data/monsters.ts
src/data/combatText.ts
```

Do not split too early. File architecture is not a boss fight.

## MVP output example

```text
****************** Round Change *********************
Ape beats its chest and watches your prompt.

> attack ape
You catch the heartbeat cleanly.
You *SPLIT* Ape with short sword.

> check ape
An Ape is near death.

****************** Round Change *********************
Ape claws you.
```

This gives the feel of old MUD combat while keeping the implementation sane.
