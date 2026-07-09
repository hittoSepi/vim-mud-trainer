# vim-mud-trainer design notes

## Core idea

`vim-mud-trainer` should not become a full Vim terminal emulator. That is how a joke project turns into a cursed research grant.

The game should teach **Vim survival**, not expert modal editing. The core pain point is not `hjkl`. The core pain point is panic caused by the user not knowing which parser is currently listening:



<div style="margin-top: 25px; margin-bottom: 25px; padding: 50px; background-color: black; color:darkgreen; font-weight: bold; display: inline-block; font-family: monospace; font-size: 1.2em; line-height: 1.5em;border:rgba(255,0,0,0) solid 10px">MOCKUP UI:
<p>
<span style="margin-top: 25px; margin-bottom: 25px; padding: 40px; background-color: black; color:darkgreen; font-weight: bold; display: inline-block; font-family: monospace; font-size: 1.2em; line-height: 1.5em;">
   LOAD 0,9 <br/>
   PRESS PLAY ON TAPE. <br/>
   Loading VIM MUD TRAINER... <br/>
   <br/>
   &gt;
</span>
<br/>
<br/>
<small>Note: the above is a joke. The game should not be a tape emulator.<br/>
But it should feel like a retro computer game, with a terminal-like interface and a sense of urgency.<br/>
No UI chrome, no mouse, no fancy graphics. Just text and panic.
Panic needs to show somehow, maybe screen tint, text wall, or NPC mockery. The player should feel trapped in a MUD room while also trapped in a Vim editor.<br/>
</small>

NO EXTERNAL UI JUST BLANK SCREEN. NO MOUSE. NO FANCY GRAPHICS. JUST TEXT AND PANIC.
</p>
</div>





<h3 style="color:rgb(200,20,20) ">When Player panics screen borders opacity increases </h3>
<h3 style="color:rgb(200,20,20) ">When the player panics, the screen border opacity increases and the borders pulse more intensely the more panicked they are.</h3>

<div style="margin-top: 25px; margin-bottom: 25px; padding: 50px; background-color: black; color:darkgreen; font-weight: bold; display: inline-block; font-family: monospace; font-size: 1.2em; line-height: 1.5em;border:rgba(255,0,0,0.15) solid 10px">MOCKUP UI:
<p>
<span style="margin-top: 25px; margin-bottom: 25px; padding: 40px; background-color: black; color:darkgreen; font-weight: bold; display: inline-block; font-family: monospace; font-size: 1.2em; line-height: 1.5em;">
   LOAD 0,9 <br/>
   PRESS PLAY ON TAPE. <br/>
   Loading VIM MUD TRAINER... <br/>
   <br/>
   &gt;
</span>
<br/>
<br/>
<small>Note: the above is a joke. The game should not be a tape emulator.<br/>
But it should feel like a retro computer game, with a terminal-like interface and a sense of urgency.<br/>
No UI chrome, no mouse, no fancy graphics. Just text and panic.
Panic needs to show somehow, maybe screen tint, text wall, or NPC mockery. The player should feel trapped in a MUD room while also trapped in a Vim editor.<br/>
</small>

NO EXTERNAL UI JUST BLANK SCREEN. NO MOUSE. NO FANCY GRAPHICS. JUST TEXT AND PANIC.
</p>
</div>



## MVP

Prototype interface showing a MUD-style room view combined with a Vim editor overlay displaying mode and command areas

- shell 
- MUD command parser
- editor normal mode
- editor insert mode
- editor command line

- git commit editor

This is the **Parser Clash**.

## Visual direction

The game should feel like a retro terminal / old computer panic screen, not a modern web app.

Mockup spirit:

```text
LOAD 0,9
PRESS PLAY ON TAPE.
Loading VIM MUD TRAINER...

>
```

The tape-loader joke is only a mood reference. The game should not become a tape emulator, because apparently one cursed emulator is enough.

Hard UI rule:

```text
NO EXTERNAL UI.
JUST BLANK SCREEN.
NO MOUSE.
NO FANCY GRAPHICS.
JUST TEXT AND PANIC.
```

There should be no visible app chrome around the game: no sidebar, no card UI, no toolbar, no button farm, no polite dashboard furniture. The player should see a black terminal-like screen with green text and a small status/prompt area.

Panic should be visualized through the screen itself, not through a friendly progress widget. When the player panics, the screen border opacity increases. As panic rises, the border should pulse more intensely and the screen may gain red tint, noise, or hostile terminal texture.

## MVP

Prototype interface showing a MUD-style room view combined with a Vim editor overlay displaying mode and command areas.

The parsers/layers to teach:

- shell
- MUD command parser
- editor normal mode
- editor insert mode
- editor command line
- git commit editor

This is the **Parser Clash**.

## UI layers

The UI should present two conceptual layers, but visually they should live inside one ascetic terminal screen.

1. **MUD world**
   - room descriptions
   - NPC tells
   - enemy pressure
   - lore and jokes
   - panic consequences
   - room progression

2.


1. **MUD world**
   - room descriptions
   - NPC tells
   - enemy pressure
   - lore and jokes
   - panic consequences
   - room progression
- 

2. **Vim Editor**
   - mode awareness
   - command buffer
   - text buffer
   - panic meter (visualized red tint, text wall, NPC mockery) does this belongs to 1.? 


The player should feel that they are inside a MUD room, but temporarily trapped inside an editor-like interface.

## ASCII world map

A small MUD-style ASCII map may appear inside the terminal screen.

Initial map should be progress-only, not movement-driven:

```text
MUD MAP
[x]--[@]--[ ]--[ ]
[x] The Wrong Parser Inn
[@] The Gate of Insert
[ ] The Swamp of Accidental Text
[ ] The Goblin Line Cave
```

Legend:

```text
[@] current room
[x] cleared room
[ ] future room
```

Do not add mouse interaction, hover states, zooming, animated map nodes, minimap widgets, or any other UI crimes. Later, Vim-style movement can become its own lesson, but map movement should not quietly hijack the survival trainer.

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

Do not emulate Vim. Track only keydown events relevant to survival commands.

```ts
type VimMode = 'normal' | 'insert' | 'command';

type VimMachineState = {
  mode: VimMode;
  commandBuffer: string;
  textBuffer: string;
  panic: number;
  message: string;
};
```

### NORMAL

Listens for a small command vocabulary:

- `i` enters INSERT
- `:` enters COMMAND
- `u` triggers undo
- `d` starts delete intent, with `dd` as delete line
- `/` enters search/command-like mode
- `?` shows emergency help

Everything else increases panic.

Example wrong input:

```text
l
score
quit
apua vittu!11
```

This should not be treated as normal text. It should raise panic and produce Wrong Parser feedback.

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

## Panic meter

Wrong parser inputs increase panic.

Panic should affect the screen, not appear as a friendly web progress bar.

Potential effects:

- mild: flavor text warnings
- medium: NPC mocks player
- high: red border opacity increases and begins pulsing harder
- critical: screen noise / red tint / text wall approaches
- max: panic failure state with Escape-based recovery

The panic meter should reinforce that wrong mode awareness is the danger.

## MVP controls

Required first survival controls:

```text
i       enter insert mode
Escape  leave insert mode / recover panic failure
?       emergency room hint
:       enter command mode
:w      save
:q!     quit without saving
:wq     save and quit
:qa!    quit all by force
dd      delete current line
u       undo
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

Use a keydown-driven reducer.

Current important files:

```text
src/engine/vimMachine.ts
src/engine/rooms.ts
src/App.tsx
src/styles.css
docs/design.md
```

React should listen to `keydown` on the terminal screen. Avoid ordinary form inputs and avoid mouse-first UI.

Lesson data should describe:

- starting mode
- accepted transitions
- success condition
- wrong parser responses
- panic thresholds
- room flavor text

## Non-goals

Do not implement:

- full Vim movement
- real buffers
- exact Ex command parsing
- plugins
- syntax highlighting
- actual terminal emulation
- modern dashboard chrome
- mouse-first controls
- decorative UI panels
- mouse-driven maps

The game is about survival and mode awareness. If it becomes a Vim clone, the dungeon has won.
