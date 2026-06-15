import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to container width. @default false */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Optional element rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Optional element rendered after the label. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Friendly rounded pill button.
 * @startingPoint section="Core" subtitle="Pill buttons — primary, secondary, ghost" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
