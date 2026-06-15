import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label (also the tooltip). */
  label: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default 'rounded' */
  shape?: 'rounded' | 'circle';
  /** @default 'soft' */
  tone?: 'soft' | 'plain' | 'brand';
  /** Icon node — typically a Lucide SVG. */
  children?: React.ReactNode;
}

/** Square/circle soft icon control for toolbars. */
export function IconButton(props: IconButtonProps): JSX.Element;
