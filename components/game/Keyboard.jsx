import React from 'react';

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['enter','z','x','c','v','b','n','m','back'],
];

/**
 * Keyboard — on-screen QWERTY. Reskins via theme CSS variables.
 * letterStates: { [letter]: 'correct'|'present'|'absent' }
 * onKey(key): key is a single lowercase letter, 'enter', or 'back'.
 */
export function Keyboard({ letterStates = {}, onKey = () => {}, style = {}, ...rest }) {
  const keyBase = {
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    color: 'var(--key-text)',
    background: 'var(--key-bg)',
    borderRadius: 'var(--key-radius)',
    boxShadow: 'var(--key-shadow)',
    height: 54,
    textTransform: 'uppercase',
    transition: 'transform var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
  };

  function stateStyle(letter) {
    const st = letterStates[letter];
    if (!st) return {};
    if (st === 'correct') return { background: 'var(--key-correct-bg)', color: '#fff', boxShadow: 'var(--key-shadow)' };
    if (st === 'present') return { background: 'var(--key-present-bg)', color: '#fff', boxShadow: 'var(--key-shadow)' };
    if (st === 'absent')  return { background: 'var(--key-absent-bg)', color: 'var(--key-absent-text)', boxShadow: 'none' };
    return {};
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', maxWidth: 500, ...style }}
      {...rest}
    >
      {ROWS.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {row.map((k) => {
            const wide = k === 'enter' || k === 'back';
            const label = k === 'enter' ? 'Enter' : k === 'back' ? '⌫' : k;
            return (
              <button
                key={k}
                type="button"
                aria-label={k === 'back' ? 'Backspace' : k}
                onClick={() => onKey(k)}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px) scale(0.95)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                style={{
                  ...keyBase,
                  ...stateStyle(k),
                  flex: wide ? '1.5 1 0' : '1 1 0',
                  minWidth: wide ? 48 : 28,
                  fontSize: wide ? 12.5 : 16,
                  letterSpacing: wide ? '0.02em' : 0,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
