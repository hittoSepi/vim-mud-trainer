export type VimMode = 'normal' | 'insert' | 'command';

type RoomId =
  | 'wrong-parser-inn'
  | 'insert-gate'
  | 'escape-swamp'
  | 'goblin-line'
  | 'regret-chamber'
  | 'save-shrine'
  | 'exit-portal'
  | 'ghost-of-qa';

type Room = {
  id: RoomId;
  area: string;
  title: string;
  startingMode: VimMode;
  goal: string;
  description: string[];
  success?: string;
};

export type VimMachineState = {
  roomId: RoomId;
  mode: VimMode;
  commandBuffer: string;
  textBuffer: string;
  pendingOperator: string | null;
  panic: number;
  xp: number;
  completedRoomIds: RoomId[];
  log: string[];
  lastKey: string;
  gameComplete: boolean;
};

export type VimMachineAction =
  | { type: 'key'; key: string; printable: boolean }
  | { type: 'reset' };

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

const roomOrder: RoomId[] = [
  'wrong-parser-inn',
  'insert-gate',
  'escape-swamp',
  'goblin-line',
  'regret-chamber',
  'save-shrine',
  'exit-portal',
  'ghost-of-qa',
];

function roomIntro(room: Room): string[] {
  return [
    `== ${room.area}: ${room.title} ==`,
    ...room.description,
    '',
    `Goal: ${room.goal}`,
  ];
}

function nextRoomId(currentRoomId: RoomId): RoomId | null {
  const index = roomOrder.indexOf(currentRoomId);
  return roomOrder[index + 1] ?? null;
}

function completeRoom(state: VimMachineState, message: string, xp = 10): VimMachineState {
  const completedRoomIds = state.completedRoomIds.includes(state.roomId)
    ? state.completedRoomIds
    : [...state.completedRoomIds, state.roomId];

  const next = nextRoomId(state.roomId);
  const nextXp = state.xp + xp;

  if (!next) {
    return {
      ...state,
      xp: nextXp,
      completedRoomIds,
      commandBuffer: '',
      pendingOperator: null,
      log: [
        ...state.log,
        message,
        `You gain ${xp} vim xp.`,
        '',
        'You escaped the Vim MUD alive.',
        'Achievement unlocked: Did Not Alt+F4 The Terminal.',
      ],
      gameComplete: true,
    };
  }

  const nextRoom = rooms[next];

  return {
    ...state,
    roomId: next,
    mode: nextRoom.startingMode,
    commandBuffer: '',
    pendingOperator: null,
    panic: Math.max(0, state.panic - 1),
    xp: nextXp,
    completedRoomIds,
    log: [
      ...state.log,
      message,
      `You gain ${xp} vim xp.`,
      '',
      ...roomIntro(nextRoom),
    ],
  };
}

function wrongParser(state: VimMachineState, key: string, message?: string): VimMachineState {
  const panic = Math.min(100, state.panic + 8);
  const panicMessage = panic >= 80
    ? 'PANIC CRITICAL. The parser goblin starts chewing the keyboard cable.'
    : panic >= 50
      ? 'Panic rises. The editor smells fear.'
      : 'Panic rises. Wrong parser.';

  return {
    ...state,
    lastKey: key,
    panic,
    pendingOperator: null,
    log: [
      ...state.log,
      `normal> ${key}`,
      message ?? panicFlavor(key),
      panicMessage,
    ],
  };
}

function panicFlavor(key: string): string {
  const known: Record<string, string> = {
    l: 'You try to look. The editor inserts no room description. It only judges you.',
    score: 'The editor does not know your level. Rude, but accurate.',
    q: 'A lonely q appears in your soul. It is not :q!.',
    quit: 'You type quit. Vim users become stronger somewhere far away.',
    '?': 'Help does not arrive. It rarely does.',
  };

  return known[key] ?? `The key ${JSON.stringify(key)} is not useful in this mode.`;
}

export function createInitialMachineState(): VimMachineState {
  const firstRoom = rooms['wrong-parser-inn'];
  return {
    roomId: firstRoom.id,
    mode: firstRoom.startingMode,
    commandBuffer: '',
    textBuffer: '',
    pendingOperator: null,
    panic: 0,
    xp: 0,
    completedRoomIds: [],
    lastKey: '',
    gameComplete: false,
    log: [
      'Welcome to vim-mud-trainer.',
      'The point is not to master Vim. The point is to survive the wrong parser.',
      '',
      ...roomIntro(firstRoom),
    ],
  };
}

export function vimMachineReducer(
  state: VimMachineState,
  action: VimMachineAction,
): VimMachineState {
  if (action.type === 'reset') {
    return createInitialMachineState();
  }

  if (state.gameComplete) {
    return state;
  }

  const key = normalizeKey(action.key);

  if (state.mode === 'insert') {
    return handleInsert(state, key, action.printable);
  }

  if (state.mode === 'command') {
    return handleCommand(state, key, action.printable);
  }

  return handleNormal(state, key);
}

function handleNormal(state: VimMachineState, key: string): VimMachineState {
  if (key === 'Escape') {
    return {
      ...state,
      pendingOperator: null,
      lastKey: key,
      log: [...state.log, 'normal> Escape', 'You are already in NORMAL mode. Still, breathing helps.'],
    };
  }

  if (key === ':') {
    return {
      ...state,
      mode: 'command',
      commandBuffer: '',
      pendingOperator: null,
      lastKey: key,
      log: [...state.log, 'normal> :', 'COMMAND mode opens. Type a survival command and press Enter.'],
    };
  }

  if (key === 'i') {
    if (state.roomId === 'insert-gate') {
      return completeRoom({ ...state, mode: 'insert', lastKey: key }, 'You enter INSERT mode. The scroll accepts your terrible ideas.', 5);
    }

    return {
      ...state,
      mode: 'insert',
      pendingOperator: null,
      lastKey: key,
      log: [...state.log, 'normal> i', 'You enter INSERT mode. Every printable key is now text. Dangerous luxury.'],
    };
  }

  if (key === 'u') {
    if (state.roomId === 'regret-chamber') {
      return completeRoom({ ...state, lastKey: key }, 'Undo succeeds. The universe politely lies about what happened.', 10);
    }

    return {
      ...state,
      pendingOperator: null,
      lastKey: key,
      log: [...state.log, 'normal> u', 'Undo ripples through the room. Nothing useful needed undoing yet.'],
    };
  }

  if (key === '/') {
    return {
      ...state,
      mode: 'command',
      commandBuffer: '/',
      pendingOperator: null,
      lastKey: key,
      log: [...state.log, 'normal> /', 'Search prompt opens. The forest of text gets nervous.'],
    };
  }

  if (key === 'd') {
    if (state.pendingOperator === 'd') {
      if (state.roomId === 'goblin-line') {
        return completeRoom(
          { ...state, pendingOperator: null, lastKey: key },
          'dd deletes the goblin line. The cave becomes 12% less embarrassing.',
          10,
        );
      }

      return {
        ...state,
        pendingOperator: null,
        lastKey: key,
        log: [...state.log, 'normal> dd', 'You delete the current line. Hopefully it deserved that.'],
      };
    }

    return {
      ...state,
      pendingOperator: 'd',
      lastKey: key,
      log: [...state.log, 'normal> d', 'Delete operator armed. Press d again for dd, because Vim enjoys suspense.'],
    };
  }

  return wrongParser(state, key);
}

function handleInsert(state: VimMachineState, key: string, printable: boolean): VimMachineState {
  if (key === 'Escape') {
    if (state.roomId === 'escape-swamp') {
      return completeRoom({ ...state, mode: 'normal', lastKey: key }, 'Escape works. You leave INSERT mode and recover one unit of dignity.', 5);
    }

    return {
      ...state,
      mode: 'normal',
      lastKey: key,
      log: [...state.log, 'insert> Escape', 'You leave INSERT mode. The text swamp stops eating keystrokes.'],
    };
  }

  if (key === 'Backspace') {
    return {
      ...state,
      textBuffer: state.textBuffer.slice(0, -1),
      lastKey: key,
    };
  }

  if (!printable) {
    return state;
  }

  return {
    ...state,
    textBuffer: state.textBuffer + key,
    lastKey: key,
  };
}

function handleCommand(state: VimMachineState, key: string, printable: boolean): VimMachineState {
  if (key === 'Escape') {
    return {
      ...state,
      mode: 'normal',
      commandBuffer: '',
      lastKey: key,
      log: [...state.log, `:${state.commandBuffer}<Esc>`, 'Command cancelled. Cowardice postponed.'],
    };
  }

  if (key === 'Backspace') {
    return {
      ...state,
      commandBuffer: state.commandBuffer.slice(0, -1),
      lastKey: key,
    };
  }

  if (key === 'Enter') {
    return runExCommand(state);
  }

  if (!printable) {
    return state;
  }

  return {
    ...state,
    commandBuffer: state.commandBuffer + key,
    lastKey: key,
  };
}

function runExCommand(state: VimMachineState): VimMachineState {
  const command = state.commandBuffer;
  const line = `:${command}`;

  if (state.roomId === 'wrong-parser-inn' && command === 'q!') {
    return completeRoom(
      { ...state, mode: 'normal', commandBuffer: '' },
      `${line} works. You flee without saving. Tactical retreat accepted.`,
      10,
    );
  }

  if (state.roomId === 'save-shrine' && command === 'w') {
    return completeRoom(
      { ...state, mode: 'normal', commandBuffer: '' },
      `${line} saves the scroll. A tiny sysadmin somewhere relaxes one shoulder.`,
      10,
    );
  }

  if (state.roomId === 'exit-portal' && command === 'wq') {
    return completeRoom(
      { ...state, mode: 'normal', commandBuffer: '' },
      `${line} saves and quits. The portal opens without filing a complaint.`,
      20,
    );
  }

  if (state.roomId === 'ghost-of-qa' && command === 'qa!') {
    return completeRoom(
      { ...state, mode: 'normal', commandBuffer: '' },
      `${line} closes every cursed buffer. The burning house collapses behind you.`,
      30,
    );
  }

  const knownCommandMessages: Record<string, string> = {
    w: `${line} writes the file. Useful, but not the answer to this room.`,
    q: `${line} tries to quit. The file may be modified. The editor smiles with too many teeth.`,
    'q!': `${line} flees without saving. Sometimes correct, sometimes just dramatic.`,
    wq: `${line} saves and quits. A classic survival spell, just not here.`,
    'qa!': `${line} quits all buffers by force. Heavy artillery. Save it for the burning house.`,
  };

  return {
    ...state,
    mode: 'normal',
    commandBuffer: '',
    panic: Math.min(100, state.panic + 6),
    log: [
      ...state.log,
      line,
      knownCommandMessages[command] ?? `Unknown Ex command: ${line}. The dungeon writes it down for later mockery.`,
      'Panic rises. Correct command, wrong room, or just pure typographical ambition.',
    ],
  };
}

function normalizeKey(key: string): string {
  if (key === 'Esc') {
    return 'Escape';
  }
  return key;
}
