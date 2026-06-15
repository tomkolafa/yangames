import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default 'md' */
  elevation?: 'flat' | 'sm' | 'md' | 'lg';
  /** Surface tint. @default 'card' */
  tone?: 'card' | 'paper' | 'sunken' | 'coral' | 'mint' | 'lavender' | 'butter' | 'sky';
  /** Inner padding. @default 'md' */
  pad?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

/**
 * Soft rounded surface.
 * @startingPoint section="Core" subtitle="Soft rounded surface, 8 tints" viewport="700x220"
 */
export function Card(props: CardProps): JSX.Element;
