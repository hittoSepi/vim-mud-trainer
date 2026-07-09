# Inventory / Insert parser clash plan

## Purpose

The key `i` is a perfect early Parser Clash lesson.

```text
MUD parser:      i = inventory
Vim NORMAL:      i = insert
```

A lost MUD player will naturally try `i` to check inventory. Vim uses `i` to enter INSERT mode. The same input has a different meaning depending on which parser is listening.

That is the core game idea compressed into one key.

## Use in the registry room

Before the form opens, the player is still in the MUD parser:

```text
> i
You check your inventory.

You are carrying:
  one unpaid municipal form
  one suspicious pencil
  zero legal identity
```

Then the clerk opens the form and the parser changes to Vim NORMAL:

```text
NORMAL> i
-- INSERT --

The clerk nods.
"Good. Now write your name before the city forgets you existed."
```

The lesson is not explained as abstract UI theory. The player experiences it:

```text
Same key.
Different listener.
Different meaning.
```

## Teaching line

Optional clerk explanation:

```text
"Outside this desk, i means inventory.
On this form, i means insert.

Do not argue with the form.
The form has tenure."
```

## Wrong parser feedback

If the player types their name in Vim NORMAL mode:

```text
NORMAL> Sepi
The form refuses the letters.
You are not in writing mode.

The clerk sighs with municipal authority.
```

If the player uses `i` in the MUD layer again later:

```text
> i
You check your inventory.
Nothing here is legally reassuring.
```

## Design rule

Do not hide this ambiguity. Use it.

The player's wrong reason for pressing `i` can lead to the correct Vim lesson. That is stronger than a prompt saying "press i to insert" like some onboarding gremlin with a clipboard.

## Implementation note

This requires the game to know whether the current parser layer is MUD or Vim NORMAL.

The same keydown should be routed differently:

```ts
if (parserLayer === 'mud') {
  // i -> inventory command
}

if (parserLayer === 'normal') {
  // i -> enter insert mode
}
```

This makes parser identity visible through behavior, not just status text.
