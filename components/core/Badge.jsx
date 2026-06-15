import React from 'react';

/**
 * Badge — small rounded label / pill for streaks, counts, "New" flags.
 * tone selects a soft pastel; variant 'solid' or 'soft'.
 */
export function Badge({
  children,
  tone = 'coral',
  variant = 'soft',
  style = {},
  ...rest
}) {
  const palette = {
    coral:    ['#E8755C', 'var(--coral-soft)', 'var(--coral-deep)'],
    mint:     ['#5AB98A', 'var(--mint-soft)', '#2E7A55'],
    lavender: ['#9B7FD4', 'var(--lavender-soft)', '#5E4A8C'],
    butter:   ['#E0A93C', 'var(--butter-soft)', '#8A6510'],
    sky:      ['#5C9FCB', 'var(--sky-soft)', '#2E6488'],
    blush:    ['#E06B96', 'var(--blush-soft)', '#9C3B62'],
    neutral:  ['#8A827B', 'var(--bg-sunken)', 'var(--ink-2)'],
  };
  const [solidBg, softBg, softText] = palette[tone] || palette.coral;
  const styles = variant === 'solid'
    ? { background: solidBg, color: '#fff' }
    : { background: softBg, color: softText };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 12.5,
        lineHeight: 1,
        letterSpacing: '0.01em',
        padding: '5px 10px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        ...styles,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
