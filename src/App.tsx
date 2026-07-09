import { useEffect, useReducer, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { createInitialMachineState, vimMachineReducer } from './engine/vimMachine';
import { roomOrder, rooms } from './engine/rooms';
import type { RoomId } from './engine/rooms';

function isPrintableKey(key: string): boolean {
  return key.length === 1;
}

function shouldCaptureKey(key: string): boolean {
  return isPrintableKey(key) || ['Escape', 'Enter', 'Backspace'].includes(key);
}

function mapMarker(roomId: RoomId, currentRoomId: RoomId, completedRoomIds: RoomId[]): string {
  if (roomId === currentRoomId) {
    return '[@]';
  }

  if (completedRoomIds.includes(roomId)) {
    return '[x]';
  }

  return '[ ]';
}

function renderAsciiMap(currentRoomId: RoomId, completedRoomIds: RoomId[]): string[] {
  const markers = roomOrder.map((roomId) => mapMarker(roomId, currentRoomId, completedRoomIds));
  const labels = roomOrder.map((roomId) => rooms[roomId].title);
  const currentLabel = rooms[currentRoomId].title;

  return [
    'MUD MAP',
    markers.join('--'),
    labels.map((label, index) => `${markers[index]} ${label}`).join('\n'),
    `You are here: ${currentLabel}`,
  ];
}

export function App() {
  const [state, dispatch] = useReducer(vimMachineReducer, undefined, createInitialMachineState);
  const logRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [state.log, state.textBuffer, state.commandBuffer]);

  useEffect(() => {
    screenRef.current?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!shouldCaptureKey(event.key)) {
      return;
    }

    event.preventDefault();
    dispatch({
      type: 'key',
      key: event.key,
      printable: isPrintableKey(event.key),
      capsLock: event.getModifierState('CapsLock'),
    });
  }

  const panicLevel = Math.min(100, state.panic);
  const commandPreview = state.mode === 'command' ? `:${state.commandBuffer}` : '';
  const statusLine = state.mode === 'insert'
    ? '-- INSERT --'
    : state.mode === 'command'
      ? commandPreview || ':'
      : '-- NORMAL --';
  const terminalStyle = { '--panic': panicLevel / 100 } as CSSProperties;
  const shouldShowHelpPrompt = state.panic >= 56 || state.phase === 'failed';
  const asciiMap = renderAsciiMap(state.roomId, state.completedRoomIds);

  return (
    <main className="screen-shell">
      <section
        className={`terminal-screen mode-${state.mode} phase-${state.phase}`}
        style={terminalStyle}
        tabIndex={0}
        ref={screenRef}
        onKeyDown={handleKeyDown}
        aria-label="vim mud trainer terminal"
      >
        <div className="terminal-output" ref={logRef} aria-live="polite">
          {state.log.map((line, index) => (
            <div key={`${index}-${line}`} className={line.startsWith('==') ? 'line room-title' : 'line'}>
              {line || '\u00A0'}
            </div>
          ))}

          {shouldShowHelpPrompt && (
            <>
              <div className="line spacer" aria-hidden="true">&nbsp;</div>
              <div className="line warning">The dungeon notices the flailing. Press ? for emergency help.</div>
            </>
          )}

          <div className="line spacer" aria-hidden="true">&nbsp;</div>
          <div className="line dim">--- WORLD MAP -------------------------------------------------------</div>
          <pre className="map-text">{asciiMap.join('\n')}</pre>

          <div className="line spacer" aria-hidden="true">&nbsp;</div>
          <div className="line dim">--- VIM BUFFER TRAP ------------------------------------------------</div>
          <pre className="buffer-text">{state.textBuffer || '/* empty buffer */'}</pre>
        </div>

        <div className="terminal-status" aria-label="status line">
          <span>{statusLine}</span>
          <span>panic {panicLevel}% | xp {state.xp} | room {state.completedRoomIds.length + 1}</span>
        </div>
      </section>
    </main>
  );
}
