import * as React from 'react';

export interface KeyboardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Per-letter best-known state. */
  letterStates?: Record<string, 'correct' | 'present' | 'absent'>;
  /** Called with a lowercase letter, 'enter', or 'back'. */
  onKey?: (key: string) => void;
}

/**
 * On-screen QWERTY keyboard.
 * @startingPoint section="Game" subtitle="Reskinnable on-screen keyboard" viewport="520x220"
 */
export function Keyboard(props: KeyboardProps): JSX.Element;
