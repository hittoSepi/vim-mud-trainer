# Procedural wilderness guardrails plan

## Purpose

Procedural ASCII wilderness can make the world feel larger, stranger, and more MUD-like. It can also quietly eat the whole project and leave only a map generator wearing Vim's skin.

So the rule must be explicit.

## Hard rule

```text
Do not procedurally generate core lessons.
Generate wilderness, filler rooms, flavour routes, minor encounters.
Hand-author teaching rooms.
```

This is not a suggestion. This is the fence around the hole.

## Why

Core lesson rooms need deliberate pacing:

- one command or parser idea at a time
- clear setup
- controlled failure cases
- specific success condition
- authored joke / theme
- predictable recovery

Procedural generation is bad at pedagogy unless carefully constrained. It can produce terrain, flavour, minor trouble, and variety. It should not decide how the player learns `i`, `Escape`, `:wq`, `dd`, `u`, or `:qa!`.

The player should never wonder whether a failed lesson is their fault, the parser's fault, or a noise function having a difficult childhood.

## Allowed procedural content

Procedural generation may create:

- wilderness ASCII maps
- filler travel rooms
- biome flavour text
- minor encounters
- ambient NPC sightings
- small loot drops
- camps / merchants
- paths between authored locations
- random scenic variations
- low-stakes monster spawns

Example:

```text
^^^^^^^^^^.......
^^^^^^^....TT....
^^^......TTTT....
.....TTTTTT......
...TTT..@..TT....
....TT.....~~....
......~~~..~~....
```

Legend:

```text
^ mountain
T forest
~ swamp / water
. plains / path
@ player
# wall / ruin / blocked route
$ shop / camp / loot source
```

## Forbidden procedural content

Do not procedurally generate:

- first-time command lessons
- Vim survival teaching rooms
- parser layer introductions
- mandatory puzzle sequences
- main quest command gates
- boss mechanics
- critical recovery tutorials
- score / registration onboarding
- any room where the exact teaching flow matters

Bad:

```text
Generated room randomly requires :wq but has no authored setup.
```

Good:

```text
Generated forest path leads to a hand-authored Locked Diff Door room that teaches :wq.
```

## World structure

Use authored islands inside generated terrain.

```text
procedural wilderness -> authored lesson dungeon -> procedural wilderness -> authored city room
```

The wilderness gives space and texture. The authored rooms carry the teaching.

## Biome room description templates

Procedural rooms can use template-based descriptions.

Forest fragments:

```ts
const forestText = {
  openers: [
    'Tall pines crowd the old road.',
    'The forest thickens around you.',
    'Wet branches scrape the terminal sky.',
  ],
  details: [
    'Something small moves under the roots.',
    'A broken sign points nowhere useful.',
    'The air smells of moss and bad decisions.',
  ],
  exits: [
    'Paths lead {exits}.',
  ],
};
```

Generated example:

```text
Tall pines crowd the old road.
Something small moves under the roots.
A broken sign points nowhere useful.

Paths lead north and east.
```

Mountain fragments:

```text
A grey ridge rises through the fog.
Loose stones click under your boots.
Far below, the forest looks like corrupted memory.

Paths lead west and down.
```

Dungeon fragments should use different tables:

```text
The corridor is narrow and badly compiled.
Old editor runes flicker on the walls.
A locked buffer-door waits to the east.
```

## Procedural recipes

Start with a tiny recipe system:

```ts
type BiomeId = 'forest' | 'mountain' | 'swamp' | 'ruin';

type GeneratedRoom = {
  id: string;
  biome: BiomeId;
  x: number;
  y: number;
  exits: Direction[];
  description: string[];
  encounterId?: string;
  landmarkId?: string;
};
```

Map generation can be simple:

- deterministic seed
- low-resolution noise or weighted random biome patches
- place authored lesson entrances manually
- connect important points with paths
- sprinkle minor encounters

Do not build climate simulation. The browser has suffered enough.

## Authored anchor points

Procedural map should contain authored anchor rooms:

- The Municipal Registry of Unnecessary Forms
- The Syntax Error Swarm
- The Locked Diff Door
- The Hall of Many Quits
- The Ghost of :qa!

Each anchor can have a fixed coordinate or be placed after generation with strict constraints.

Example:

```ts
type AuthoredAnchor = {
  roomId: string;
  requiredBiome?: BiomeId;
  minDistanceFromStart?: number;
  teaches: string[];
};
```

## MVP slice

First procedural experiment:

- 8x8 wilderness map
- 3 biomes: forest, mountain, swamp
- 1 authored city/registry room at start
- 1 authored lesson dungeon entrance
- generated filler room descriptions
- no procedural lessons
- no procedural boss rooms

This is enough to test the feel without declaring war on scope.

## Design mantra

```text
Procedural space gives the player somewhere to wander.
Authored rooms teach the player how to survive.
```

Keep this separation. If it blurs, the project becomes a procedural MUD generator and the original trainer dies quietly in a generated swamp.
