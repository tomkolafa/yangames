import * as React from 'react';

export type TileState = 'empty' | 'tbd' | 'absent' | 'present' | 'correct';

export interface TileProps extends React.HTMLAttributes<HTMLDivElement> {
  letter?: string;
  /** @default 'empty' */
  state?: TileState;
  /** Pixel size of the square. @default 58 */
  size?: number;
  /** Background override for evaluated tiles (funky rainbow skin). */
  accent?: string | null;
  /** Text colour paired with `accent`. */
  accentText?: string | null;
  /** Brief pop animation when a letter is entered. */
  pop?: boolean;
  /** Flip-in reveal for evaluated tiles. */
  reveal?: boolean;
  /** Stagger delay (ms) for reveal. */
  revealDelay?: number;
}

/** A single letter cell. Reskins through theme variables. */
export function Tile(props: TileProps): JSX.Element;
