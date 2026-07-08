import type { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'wrong-parser-inn',
    title: 'The Wrong Parser Inn',
    area: 'Newbie Pond',
    mode: 'normal',
    description: [
      'You wake up inside a text editor, absolutely convinced you are still in a MUD.',
      'A retired duck in ceremonial armor watches you type MUD commands into the wrong parser.',
      'Somewhere in the distance, an ancient terminal sighs.',
    ],
    goal: 'Escape without saving. Use the emergency quit command.',
    prompt: 'editor>',
    commands: [
      {
        input: ':q!',
        message: 'You flee without saving. Tactical retreat successful. The duck nods once.',
        nextLessonId: 'insert-gate',
        mode: 'normal',
        xp: 10,
      },
    ],
    wrongCommandResponses: {
      l: 'You type l. The room does not look around. Wrong parser, feathered disaster.',
      look: 'The editor refuses to describe the room. It has standards, apparently.',
      score: 'The editor does not know your level. Rude, but accurate.',
      quit: 'You type quit. Nothing happens. Somewhere, Vim users become stronger.',
      q: 'A lonely q appears. It does not save you.',
      '^q': 'Control-Q does not rescue your dignity.',
      'apua vittu!11': 'A senior duck appears and whispers: try :q!, tragic mammal.',
    },
    defaultWrongResponse: 'The editor ignores your worldview. Try thinking like Vim, regrettably.',
  },
  {
    id: 'insert-gate',
    title: 'The Gate of Insert',
    area: 'Newbie Pond',
    mode: 'normal',
    description: [
      'A blank scroll floats in the air.',
      'You cannot write on it from normal mode. This is not user-friendly. This is tradition.',
    ],
    goal: 'Enter insert mode.',
    prompt: 'normal>',
    commands: [
      {
        input: 'i',
        message: 'You enter INSERT MODE. The scroll accepts your terrible ideas.',
        nextLessonId: 'escape-swamp',
        mode: 'insert',
        xp: 5,
      },
    ],
    defaultWrongResponse: 'The scroll remains blank. Press i to enter insert mode.',
  },
  {
    id: 'escape-swamp',
    title: 'The Swamp of Accidental Text',
    area: 'Insert Swamp',
    mode: 'insert',
    description: [
      'You are now in insert mode.',
      'Every key becomes text. This is power. This is also how disasters become files.',
    ],
    goal: 'Leave insert mode.',
    prompt: 'insert>',
    commands: [
      {
        input: 'esc',
        message: 'You leave insert mode. The swamp stops eating keystrokes.',
        nextLessonId: 'goblin-line',
        mode: 'normal',
        xp: 5,
      },
      {
        input: 'escape',
        message: 'You leave insert mode. The swamp stops eating keystrokes.',
        nextLessonId: 'goblin-line',
        mode: 'normal',
        xp: 5,
      },
    ],
    defaultWrongResponse: 'You add more accidental text. Use Esc, written here as esc.',
  },
  {
    id: 'goblin-line',
    title: 'The Goblin Line Cave',
    area: 'Goblin Editor Cave',
    mode: 'normal',
    description: [
      'A useless line blocks the tunnel:',
      'TODO: fix later maybe lol',
      'The goblin responsible looks proud. Horrible little creature.',
    ],
    goal: 'Delete the current line.',
    prompt: 'normal>',
    commands: [
      {
        input: 'dd',
        message: 'You delete the goblin line. The cave becomes 12% less embarrassing.',
        nextLessonId: 'regret-chamber',
        mode: 'normal',
        xp: 10,
      },
    ],
    defaultWrongResponse: 'The goblin line remains. Use dd to delete the current line.',
  },
  {
    id: 'regret-chamber',
    title: 'The Regret Chamber',
    area: 'Goblin Editor Cave',
    mode: 'normal',
    description: [
      'You deleted something. Naturally, it was important after all.',
      'The chamber fills with the smell of consequences.',
    ],
    goal: 'Undo the previous action.',
    prompt: 'normal>',
    commands: [
      {
        input: 'u',
        message: 'Undo succeeds. The universe pretends this never happened.',
        nextLessonId: 'save-shrine',
        mode: 'normal',
        xp: 10,
      },
    ],
    defaultWrongResponse: 'Regret intensifies. Use u to undo.',
  },
  {
    id: 'save-shrine',
    title: 'The Save Shrine',
    area: 'Newbie Pond',
    mode: 'normal',
    description: [
      'A shrine demands that you save your work.',
      'It has seen too many people close terminals like frightened woodland animals.',
    ],
    goal: 'Save the file.',
    prompt: 'normal>',
    commands: [
      {
        input: ':w',
        message: 'The scroll is saved. A tiny sysadmin somewhere relaxes one shoulder.',
        nextLessonId: 'exit-portal',
        mode: 'normal',
        xp: 10,
      },
    ],
    defaultWrongResponse: 'The shrine waits. Use :w to save.',
  },
  {
    id: 'exit-portal',
    title: 'The Exit Portal',
    area: 'Newbie Pond',
    mode: 'normal',
    description: [
      'A portal opens. It is probably safe. Probably.',
      'Save and quit to leave the dungeon alive.',
    ],
    goal: 'Save and quit.',
    prompt: 'normal>',
    commands: [
      {
        input: ':wq',
        message: 'You save and quit. Achievement unlocked: Did Not Alt+F4 The Terminal.',
        mode: 'normal',
        xp: 20,
      },
    ],
    defaultWrongResponse: 'The portal flickers. Use :wq to save and quit.',
  },
];

export function getLesson(id: string): Lesson {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) {
    throw new Error(`Unknown lesson: ${id}`);
  }
  return lesson;
}
