export type VimMode = 'normal' | 'insert' | 'command';

export type RoomId =
  | 'wrong-parser-inn'
  | 'insert-gate'
  | 'escape-swamp'
  | 'goblin-line'
  | 'regret-chamber'
  | 'caps-lock-curse'
  | 'save-shrine'
  | 'git-commit-abyss'
  | 'exit-portal'
  | 'ghost-of-qa';

export type Room = {
  id: RoomId;
  area: string;
  title: string;
  startingMode: VimMode;
  goal: string;
  description: string[];
  success?: string;
};

export const rooms: Record<RoomId, Room> = {
  'wrong-parser-inn': {
    id: 'wrong-parser-inn',
    area: 'Newbie Pond',
    title: 'The Wrong Parser Inn',
    startingMode: 'normal',
    goal: 'You are trapped in the wrong parser. Escape without saving with :q!.',
    description: [
      'You wake up inside a text editor, absolutely convinced you are still in a MUD.',
      'A retired duck in ceremonial armor watches you type MUD commands into the wrong parser.',
      'The editor waits. It does not understand look, score, quit, or emotional bargaining.',
    ],
  },
  'insert-gate': {
    id: 'insert-gate',
    area: 'Newbie Pond',
    title: 'The Gate of Insert',
    startingMode: 'normal',
    goal: 'Enter insert mode with i.',
    description: [
      'A blank scroll floats in the air.',
      'You cannot write on it from normal mode. This is not user-friendly. This is tradition.',
    ],
  },
  'escape-swamp': {
    id: 'escape-swamp',
    area: 'Insert Swamp',
    title: 'The Swamp of Accidental Text',
    startingMode: 'insert',
    goal: 'Leave insert mode with Escape.',
    description: [
      'You are now in insert mode.',
      'Every printable key becomes text. This is power. This is also how disasters become files.',
    ],
  },
  'goblin-line': {
    id: 'goblin-line',
    area: 'Goblin Editor Cave',
    title: 'The Goblin Line Cave',
    startingMode: 'normal',
    goal: 'Delete the current line with dd.',
    description: [
      'A useless line blocks the tunnel:',
      'TODO: fix later maybe lol',
      'The goblin responsible looks proud. Horrible little creature.',
    ],
  },
  'regret-chamber': {
    id: 'regret-chamber',
    area: 'Goblin Editor Cave',
    title: 'The Regret Chamber',
    startingMode: 'normal',
    goal: 'Undo the previous action with u.',
    description: [
      'You deleted something. Naturally, it was important after all.',
      'The chamber fills with the smell of consequences.',
    ],
  },
  'caps-lock-curse': {
    id: 'caps-lock-curse',
    area: 'Keyboard Crypt',
    title: 'The Caps Lock Curse',
    startingMode: 'normal',
    goal: 'Break the curse with lowercase u. Uppercase panic is still panic.',
    description: [
      'A cursed keycap altar glows with bureaucratic menace.',
      'Commands are case-sensitive here. I know. Civilization has clearly peaked.',
      'Use lowercase u to prove your keyboard is not currently possessed.',
    ],
  },
  'save-shrine': {
    id: 'save-shrine',
    area: 'Newbie Pond',
    title: 'The Save Shrine',
    startingMode: 'normal',
    goal: 'Open command mode with :, type w, press Enter.',
    description: [
      'A shrine demands that you save your work.',
      'It has seen too many people close terminals like frightened woodland animals.',
    ],
  },
  'git-commit-abyss': {
    id: 'git-commit-abyss',
    area: 'Repository Catacombs',
    title: 'Git Commit Abyss',
    startingMode: 'normal',
    goal: 'Write a commit message: i, type text, Escape, then :wq.',
    description: [
      'Git has opened an editor for a commit message. Naturally, nobody asked politely.',
      'Shell commands do not belong here. MUD commands do not belong here. Screaming is accepted but not persisted.',
      'Enter insert mode, write a message, leave insert mode, then save and quit.',
    ],
  },
  'exit-portal': {
    id: 'exit-portal',
    area: 'Newbie Pond',
    title: 'The Exit Portal',
    startingMode: 'normal',
    goal: 'Open command mode with :, type wq, press Enter.',
    description: [
      'A portal opens. It is probably safe. Probably.',
      'Save and quit to leave the dungeon alive.',
    ],
  },
  'ghost-of-qa': {
    id: 'ghost-of-qa',
    area: 'Burning Buffer House',
    title: 'The Ghost of :qa!',
    startingMode: 'normal',
    goal: 'Close every cursed buffer with :qa!.',
    description: [
      'Every file you have ever opened is now open again.',
      'The house is burning. A wall of text crawls toward you from the ceiling.',
      'The ghost whispers: one command to flee them all.',
    ],
  },
};

export const roomOrder: RoomId[] = [
  'wrong-parser-inn',
  'insert-gate',
  'escape-swamp',
  'goblin-line',
  'regret-chamber',
  'caps-lock-curse',
  'save-shrine',
  'git-commit-abyss',
  'exit-portal',
  'ghost-of-qa',
];
