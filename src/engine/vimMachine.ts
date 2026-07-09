import { roomOrder, rooms } from './rooms';
import type { Room, RoomId, VimMode } from './rooms';

export type { Room, RoomId, VimMode } from './rooms';

export type PanicPhase = 'playing' | 'failed';

export type VimMachineState = {
  roomId: RoomId;
  mode: VimMode;
  phase: PanicPhase;
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
  | { type: 'key'; key: string; printable: boolean; capsLock?: boolean }
  | { type: 'reset' }
  | { type: 'start-room'; roomId: RoomId };

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

function roomHint(roomId: RoomId): string {
  const hints: Record<RoomId, string> = {
    'wrong-parser-inn': 'Hint: you are in NORMAL mode. Press :, type q!, then press Enter.',
    'insert-gate': 'Hint: press lowercase i. Not look, not quit, not a heartfelt apology.',
    'escape-swamp': 'Hint: you are in INSERT mode. Press Escape to stop feeding text to the swamp.',
    'goblin-line': 'Hint: press d twice: dd. One d only arms the delete operator, because suspense was apparently necessary.',
    'regret-chamber': 'Hint: press lowercase u to undo. This is one of the few mercies granted by the dungeon.',
    'caps-lock-curse': 'Hint: turn Caps Lock off and press lowercase u. The keyboard must stop shouting first.',
    'save-shrine': 'Hint: press :, type w, then press Enter.',
    'git-commit-abyss': 'Hint: press i, write a short commit message, press Escape, then use :wq.',
    'exit-portal': 'Hint: press :, type wq, then press Enter.',
    'ghost-of-qa': 'Hint: press :, type qa!, then press Enter. Burn the buffers from orbit.',
  };

  return hints[roomId];
}

function showEmergencyHelp(state: VimMachineState): VimMachineState {
  return {
    ...state,
    lastKey: '?',
    pendingOperator: null,
    log: [
      ...state.log,
      '?> emergency help opens reluctantly.',
      roomHint(state.roomId),
    ],
  };
}

function createRoomStartState(roomId: RoomId, completedRoomIds: RoomId[] = [], xp = 0): VimMachineState {
  const room = rooms[roomId];
  return {
    roomId: room.id,
    mode: room.startingMode,
    phase: 'playing',
    commandBuffer: '',
    textBuffer: '',
    pendingOperator: null,
    panic: 0,
    xp,
    completedRoomIds,
    lastKey: '',
    gameComplete: false,
    log: [
      'Welcome to vim-mud-trainer.',
      'The point is not to master Vim. The point is to survive the wrong parser.',
      '',
      ...roomIntro(room),
    ],
  };
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
      phase: 'playing',
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
    phase: 'playing',
    commandBuffer: '',
    textBuffer: next === 'git-commit-abyss' ? '' : state.textBuffer,
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

function panicFailure(state: VimMachineState): VimMachineState {
  return {
    ...state,
    phase: 'failed',
    mode: 'normal',
    commandBuffer: '',
    pendingOperator: null,
    panic: 100,
    log: [
      ...state.log,
      '',
      'PANIC FAILURE. The room fills with fake terminal output and one smug goblin helpfully types quit for you.',
      'Press Escape to recover. Press ? for emergency help, because apparently even dungeons need support desks.',
    ],
  };
}

function withPanic(state: VimMachineState, amount: number): VimMachineState {
  const panic = Math.min(100, state.panic + amount);
  const next = { ...state, panic };
  return panic >= 100 ? panicFailure(next) : next;
}

function wrongParser(state: VimMachineState, key: string, message?: string): VimMachineState {
  const panic = Math.min(100, state.panic + 8);
  const helpMessage = panic >= 56 ? 'The terminal grudgingly admits: press ? for emergency help.' : '';
  const panicMessage = panic >= 80
    ? 'PANIC CRITICAL. The parser goblin starts chewing the keyboard cable.'
    : panic >= 50
      ? 'Panic rises. The editor smells fear.'
      : 'Panic rises. Wrong parser.';

  const nextState = {
    ...state,
    lastKey: key,
    panic,
    pendingOperator: null,
    log: [
      ...state.log,
      `normal> ${key}`,
      message ?? panicFlavor(key),
      panicMessage,
      ...(helpMessage ? [helpMessage] : []),
    ],
  };

  return panic >= 100 ? panicFailure(nextState) : nextState;
}

function panicFlavor(key: string): string {
  const known: Record<string, string> = {
    I: 'Uppercase I is not lowercase i. The curse applauds your keyboard management.',
    U: 'Uppercase U is not undo here. Case matters, because apparently suffering needed capitalization.',
    l: 'You try to look. The editor inserts no room description. It only judges you.',
    score: 'The editor does not know your level. Rude, but accurate.',
    q: 'A lonely q appears in your soul. It is not :q!.',
    quit: 'You type quit. Vim users become stronger somewhere far away.',
  };

  return known[key] ?? `The key ${JSON.stringify(key)} is not useful in this mode.`;
}

export function createInitialMachineState(): VimMachineState {
  return createRoomStartState('wrong-parser-inn');
}

export function vimMachineReducer(
  state: VimMachineState,
  action: VimMachineAction,
): VimMachineState {
  if (action.type === 'reset') {
    return createInitialMachineState();
  }

  if (action.type === 'start-room') {
    return createRoomStartState(action.roomId);
  }

  if (state.gameComplete) {
    return state;
  }

  const normalizedKey = normalizeKey(action.key);

  if (state.phase === 'failed') {
    return handlePanicRecovery(state, normalizedKey);
  }

  const key = applyCapsLockCurse(state, normalizedKey, action.capsLock ?? false);

  if (state.mode === 'insert') {
    return handleInsert(state, key, action.printable);
  }

  if (state.mode === 'command') {
    return handleCommand(state, key, action.printable);
  }

  return handleNormal(state, key);
}

function handlePanicRecovery(state: VimMachineState, key: string): VimMachineState {
  if (key === '?') {
    return showEmergencyHelp(state);
  }

  if (key !== 'Escape') {
    return {
      ...state,
      lastKey: key,
      log: [...state.log, 'Panic has the keyboard. Press Escape. Press ? if you need the dungeon to explain itself slowly.'],
    };
  }

  const room = rooms[state.roomId];
  return {
    ...state,
    phase: 'playing',
    mode: room.startingMode,
    commandBuffer: '',
    pendingOperator: null,
    panic: 35,
    lastKey: key,
    log: [
      ...state.log,
      'Escape cuts through the panic wall. You are back in the lesson, slightly singed.',
      '',
      ...roomIntro(room),
    ],
  };
}

function applyCapsLockCurse(state: VimMachineState, key: string, capsLock: boolean): string {
  if (state.roomId !== 'caps-lock-curse' || !capsLock || key.length !== 1) {
    return key;
  }

  return key.toUpperCase();
}

function handleNormal(state: VimMachineState, key: string): VimMachineState {
  if (key === '?') {
    return showEmergencyHelp(state);
  }

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

    if (state.roomId === 'caps-lock-curse') {
      return completeRoom({ ...state, lastKey: key }, 'Lowercase u breaks the Caps Lock Curse. The keyboard stops shouting at everyone.', 10);
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

  if (state.roomId === 'git-commit-abyss' && command === 'wq') {
    if (state.textBuffer.trim().length < 3) {
      return withPanic({
        ...state,
        mode: 'normal',
        commandBuffer: '',
        log: [
          ...state.log,
          line,
          'Git refuses the empty commit message. Even Git has standards, which should worry everyone.',
          'Write something in INSERT mode first: i, message, Escape, :wq.',
        ],
      }, 10);
    }

    return completeRoom(
      { ...state, mode: 'normal', commandBuffer: '' },
      `${line} saves the commit message. Git stops holding the terminal hostage.`,
      20,
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

  return withPanic({
    ...state,
    mode: 'normal',
    commandBuffer: '',
    log: [
      ...state.log,
      line,
      knownCommandMessages[command] ?? `Unknown Ex command: ${line}. The dungeon writes it down for later mockery.`,
      'Panic rises. Correct command, wrong room, or just pure typographical ambition.',
    ],
  }, 6);
}

function normalizeKey(key: string): string {
  if (key === 'Esc') {
    return 'Escape';
  }
  return key;
}
