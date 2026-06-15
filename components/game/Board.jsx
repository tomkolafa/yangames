import React from 'react';
import { Tile } from './Tile.jsx';

const FUNKY = ['var(--funky-1)','var(--funky-2)','var(--funky-3)','var(--funky-4)','var(--funky-5)','var(--funky-6)'];
const FUNKY_TEXT = ['#7A1F45','#7A3B0A','#4A3B05','#15321F','#143A5C','#3A2566'];

/**
 * Board — the guess grid. Pure presentation.
 * guesses: Array<{ letters: string[], states: string[] }>  (submitted rows)
 * current: string (the row being typed)
 * rows / cols: grid shape (default 6 × 5)
 * rainbow: funky skin — evaluated tiles colored by column
 * reveal: animate the last submitted row flipping in
 */
export function Board({
  guesses = [],
  current = '',
  rows = 6,
  cols = 5,
  tileSize = 58,
  rainbow = false,
  reveal = false,
  invalidRow = -1,
  style = {},
  ...rest
}) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const submitted = guesses[r];
    const isCurrent = r === guesses.length;
    const cells = [];
    for (let c = 0; c < cols; c++) {
      let letter = '', state = 'empty', accent = null, accentText = null;
      if (submitted) {
        letter = submitted.letters[c] || '';
        state = submitted.states[c] || 'absent';
        if (rainbow && state !== 'empty') {
          accent = FUNKY[c % FUNKY.length];
          accentText = FUNKY_TEXT[c % FUNKY_TEXT.length];
        }
      } else if (isCurrent) {
        letter = current[c] || '';
        state = letter ? 'tbd' : 'empty';
      }
      cells.push(
        <Tile
          key={c}
          letter={letter}
          state={state}
          size={tileSize}
          accent={accent}
          accentText={accentText}
          pop={isCurrent && letter && c === current.length - 1}
          reveal={reveal && r === guesses.length - 1}
          revealDelay={c * 300}
        />
      );
    }
    grid.push(
      <div
        key={r}
        style={{
          display: 'flex',
          gap: 'var(--tile-gap)',
          animation: r === invalidRow ? 'wl-shake 480ms var(--ease-soft)' : 'none',
        }}
      >
        {cells}
      </div>
    );
  }
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tile-gap)', ...style }}
      {...rest}
    >
      {grid}
    </div>
  );
}
