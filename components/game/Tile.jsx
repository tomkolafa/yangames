import React from 'react';

/**
 * Tile — a single letter cell. Reskins via theme CSS variables.
 * state: 'empty' | 'tbd' (typed, unsubmitted) | 'absent' | 'present' | 'correct'
 * accent / accentText: optional bg/text override (used by the funky rainbow skin).
 * pop: brief scale when a letter is entered. reveal: flip-in for evaluated tiles.
 */
export function Tile({
  letter = '',
  state = 'empty',
  size = 58,
  accent = null,
  accentText = null,
  pop = false,
  reveal = false,
  revealDelay = 0,
  style = {},
  ...rest
}) {
  const evaluated = state === 'absent' || state === 'present' || state === 'correct';

  let bg, border, color;
  if (state === 'empty') {
    bg = 'var(--tile-empty-bg)';
    border = '2px solid var(--tile-empty-border)';
    color = 'var(--tile-text)';
  } else if (state === 'tbd') {
    bg = 'var(--tile-filled-bg)';
    border = '2px solid var(--tile-filled-border)';
    color = 'var(--tile-text)';
  } else {
    bg = `var(--state-${state}-bg)`;
    border = '2px solid transparent';
    color = `var(--state-${state}-text)`;
  }
  if (accent && evaluated) { bg = accent; color = accentText || '#fff'; }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border,
        color,
        borderRadius: 'var(--tile-radius)',
        boxShadow: evaluated ? 'var(--tile-shadow)' : 'none',
        fontFamily: 'var(--font-tile)',
        fontWeight: 'var(--tile-weight)',
        fontSize: Math.round(size * 0.46),
        lineHeight: 1,
        textTransform: 'uppercase',
        userSelect: 'none',
        transition: 'background var(--dur-base) var(--ease-soft), border-color var(--dur-base) var(--ease-soft), transform var(--dur-fast) var(--ease-bounce)',
        animation: pop
          ? 'wl-pop 140ms var(--ease-bounce)'
          : reveal
          ? `wl-reveal 650ms var(--ease-soft) ${revealDelay}ms both`
          : 'none',
        ...style,
      }}
      {...rest}
    >
      {letter}
    </div>
  );
}
