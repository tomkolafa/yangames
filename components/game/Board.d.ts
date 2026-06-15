import * as React from 'react';

export interface Guess {
  letters: string[];
  states: ('absent' | 'present' | 'correct')[];
}

export interface BoardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Submitted rows. */
  guesses?: Guess[];
  /** The row currently being typed. */
  current?: string;
  /** @default 6 */
  rows?: number;
  /** @default 5 */
  cols?: number;
  /** @default 58 */
  tileSize?: number;
  /** Funky skin — colour evaluated tiles by column. @default false */
  rainbow?: boolean;
  /** Flip-in the most recently submitted row. */
  reveal?: boolean;
  /** Index of a row to shake (invalid word). @default -1 */
  invalidRow?: number;
}

/**
 * The guess grid.
 * @startingPoint section="Game" subtitle="Wordle guess grid — any theme" viewport="420x520"
 */
export function Board(props: BoardProps): JSX.Element;
