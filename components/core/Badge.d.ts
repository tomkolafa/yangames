import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'coral' */
  tone?: 'coral' | 'mint' | 'lavender' | 'butter' | 'sky' | 'blush' | 'neutral';
  /** @default 'soft' */
  variant?: 'soft' | 'solid';
  children?: React.ReactNode;
}

/** Small rounded label / pill. */
export function Badge(props: BadgeProps): JSX.Element;
