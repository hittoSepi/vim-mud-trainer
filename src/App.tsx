import { useEffect, useReducer, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { createInitialMachineState, vimMachineReducer } from './engine/vimMachine';

function isPrintableKey(key: string): boolean {
  return key.length === 1;
}

function shouldCaptureKey(key: string): boolean {
  return isPrintableKey(key) || ['Escape', 'Enter', 'Backspace'].includes(key);
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
