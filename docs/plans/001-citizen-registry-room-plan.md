# Citizen Registry room plan

## Purpose

This room turns the basic `INSERT -> Escape -> :wq` survival pattern into a MUD-world action instead of a naked tutorial.

The player is a new arrival in the city. Before they can enter the wider MUD world, they must register their character in the city papers.

This teaches:

- enter INSERT mode with `i`
- type player details as text
- leave INSERT mode with `Escape`
- finish the paperwork with `:wq`
- understand that text belongs in INSERT mode, not NORMAL mode

The joke is bureaucracy. The lesson is modal editing. Humanity truly did all this to itself.

## Working title

```text
The Municipal Registry of Unnecessary Forms
```

Alternative titles:

```text
The City Clerk of Insert Mode
The Newcomer Ledger
The Bureau of Character Legality
The Office of Mandatory Arrival
```

## Room pitch

```text
You stand before a dusty municipal desk.
A clerk with ink-stained fingers peers over a terminal older than regret.

"New arrival? Then you must be written into the city papers."

The clerk pushes a blank form toward you.
"Enter writing mode, fill in your details, and leave the form properly."
```

## Mechanics

Starting parser layer:

```text
editor NORMAL
```

Goal:

```text
Enter INSERT mode, type a short registration line, return to NORMAL, then save and quit with :wq.
```

Required sequence:

```text
i
<type any registration text>
Escape
:wq
```

Minimum valid text:

```text
3+ non-whitespace characters
```

Example valid text:

```text
Sepi the Coder
```

## Success output

```text
:wq
The clerk stamps the form with excessive force.
"Registered. Barely."

You gain 12 xp.
You receive 3 gold for not eating the pencil.
The city gates open to the north.
```

## Failure / wrong parser flavour

Typing MUD commands in NORMAL mode:

```text
normal> score
The clerk frowns. "You do not have papers yet. Try becoming legally real first."
Panic rises. Wrong parser.
```

Trying to save too early:

```text
:wq
The clerk examines the empty form.
"This is not a character. This is administrative silence."
Write something first: i, details, Escape, :wq.
```

Typing `quit` in NORMAL:

```text
normal> quit
The clerk says: "Leaving is also a form. You have not filled that one either."
Panic rises. Wrong parser.
```

Pressing `Escape` in NORMAL:

```text
normal> Escape
You are already in NORMAL mode.
The clerk appreciates the fear, but not the paperwork.
```

## Reward

Initial reward should be tiny but visible:

```text
+12 xp
+3 gold
registered citizen flag
```

This supports the numbers-grow loop without turning the first room into tax software, although the danger is obvious.

## Prompt after completion

```text
[00:02] panic:0 $:3 hp:10/10 sp:5/5 >
```

## Design notes

This is a stronger first INSERT lesson than a generic gate.

The player is not told "press i because Vim". They are told "the city form is blank and you need writing mode".

The room should feel like MUD bureaucracy, not modern onboarding. No pop-up help. No friendly wizard. Just a clerk, a form, and the grim historical fact that paperwork survived the apocalypse.

## Future hooks

The registration text can later become part of the character sheet:

```text
Name: Sepi Rauskunen the overworked, underpaid meany.
Citizenship: reluctantly filed
```

The registry clerk can return as an NPC merchant / quest giver / administrative villain.

Possible later gag:

```text
The clerk says: "Your reincarnation requires Form :qa!-17B."
```
