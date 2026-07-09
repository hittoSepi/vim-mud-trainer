# Combat text and heartbeat crit plan

## Purpose

Combat should avoid raw damage numbers in normal play.

Instead of:

```text
You hit Ape for 7 damage.
```

Prefer:

```text
You stab Ape with short sword.
You slash Ape with short sword.
You CUT Ape with short sword.
You *SPLIT* Ape with short sword.
```

The hidden number still exists. The player reads the violence as MUD text, because this is a text game and apparently we are going to use text. Bold concept.

## Core rule

Damage is numeric internally, descriptive externally.

- Normal hits use plain verbs.
- Strong hits use stronger verbs.
- Critical hits can use uppercase words.
- Rare supercrit hits can use emphasized words like `*SPLIT*`.

Do not print direct damage values by default.

## Hit text bands

For a short sword:

```text
Graze:     You nick Ape with short sword.
Light:     You stab Ape with short sword.
Medium:    You slash Ape with short sword.
Heavy:     You CUT Ape with short sword.
Crit:      You MANGLE Ape with short sword.
Supercrit: You *SPLIT* Ape with short sword.
```

For an axe later:

```text
Graze:     You clip Goblin with rusty axe.
Light:     You chop Goblin with rusty axe.
Medium:    You hack Goblin with rusty axe.
Heavy:     You CLEAVE Goblin with rusty axe.
Crit:      You MUTILATE Goblin with rusty axe.
Supercrit: You *DISASSEMBLE* Goblin with rusty axe.
```

For Vim-flavoured attacks:

```text
Light:     Line Rend tears at Syntax Goblin.
Medium:    Line Rend rips Syntax Goblin open.
Heavy:     Line Rend DELETES a chunk of Syntax Goblin.
Crit:      Line Rend SHREDS Syntax Goblin into tokens.
Supercrit: Line Rend *REMOVES* Syntax Goblin from the buffer.
```

## Enemy condition remains fuzzy

After hits, do not show HP by default.

Use `check <target>`:

```text
> check ape
An Ape is badly hurt.
```

Hit lines and check lines work together:

```text
You CUT Ape with short sword.
> check ape
An Ape is in bad shape.
```

The player learns combat state by reading, not by staring at a bar graph like a dashboard mammal.

## Heartbeat rhythm crits

Combat can become a small rhythm game without turning into DDR for sysadmins.

The heartbeat is the timing anchor:

```text
Heartbeat: every 3 seconds
```

Player actions can get crit chance based on how closely they land after a heartbeat / round change.

Example timing windows after heartbeat:

```text
0-250 ms      perfect window: high crit chance, tiny supercrit chance
250-700 ms    good window: modest crit chance
700-1500 ms   normal window: normal hit chance
1500-3000 ms  late window: lower crit chance, higher fumble/panic chance
```

This rewards MUD-veteran heartbeat timing without requiring frame-perfect nonsense. The goal is rhythm awareness, not esports arthritis.

## Round change output

```text
****************** Round Change *********************
```

At round change:

- pending casts tick down
- enemies act
- player timing window resets
- combat text resolves
- panic/HP/SP may change

The round change line should feel slightly dramatic and old-school.

## Crit chance idea

Example rough model:

```ts
type TimingQuality = 'perfect' | 'good' | 'normal' | 'late';

const timingCritBonus = {
  perfect: 0.25,
  good: 0.10,
  normal: 0,
  late: -0.05,
};
```

Supercrit should be rare:

```text
perfect timing + rare roll + suitable weapon/spell
```

Do not let supercrit become common. If every hit is `*SPLIT*`, the word becomes oatmeal.

## Feedback without numbers

Good timing feedback:

```text
You strike just after the heartbeat.
You CUT Ape with short sword.
```

Perfect timing feedback:

```text
You catch the heartbeat cleanly.
You *SPLIT* Ape with short sword.
```

Late timing feedback:

```text
You swing late.
You stab Ape with short sword.
```

Fumble:

```text
You miss the rhythm and overthink the keyboard.
Ape avoids the blow.
Panic rises.
```

## Caps and emphasis rule

Use caps sparingly.

- lowercase/plain verbs: normal combat
- uppercase verb: heavy/crit
- `*WORD*`: rare supercrit

Examples:

```text
You stab Ape with short sword.
You slash Ape with short sword.
You CUT Ape with short sword.
You *SPLIT* Ape with short sword.
```

This keeps impact readable without dumping damage numbers into the scrollback.

## Text volume problem

MUD text is powerful, but the project can drown in text content.

Mitigation:

- Build small reusable text tables.
- Generate hit lines from `{verb} {target} with {weapon}` templates.
- Give each weapon a small verb table.
- Give each monster a small condition table.
- Add bespoke jokes only where they teach or reward.

Example data:

```ts
type WeaponText = {
  itemId: string;
  graze: string[];
  light: string[];
  medium: string[];
  heavy: string[];
  crit: string[];
  supercrit: string[];
};
```

Keep the authored text count low early. Otherwise the goblin wins by content backlog.

## MVP slice

First prototype:

- one weapon: `short sword`
- one enemy: `Ape` or `Syntax Goblin`
- one heartbeat timer
- one action: `attack ape` or later `cast :w at monster`
- no visible damage numbers
- `check monster` shows condition
- timing affects hit text / crit chance

Example loop:

```text
****************** Round Change *********************
Ape beats its chest and watches your prompt.

> attack ape
You strike just after the heartbeat.
You CUT Ape with short sword.

> check ape
An Ape is badly hurt.
```

This proves the MUD rhythm and text-combat feel before any sane person suggests 200 weapons.
