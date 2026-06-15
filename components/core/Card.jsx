import React from 'react';

/**
 * Card — soft raised surface with generous rounding.
 * elevation: 'flat' | 'sm' | 'md' | 'lg'. tone tints the surface.
 */
export function Card({
  children,
  elevation = 'md',
  tone = 'card',
  pad = 'md',
  style = {},
  ...rest
}) {
  const shadows = {
    flat: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  };
  const tones = {
    card:     'var(--surface-card)',
    paper:    'var(--bg-app)',
    sunken:   'var(--bg-sunken)',
    coral:    'var(--coral-soft)',
    mint:     'var(--mint-soft)',
    lavender: 'var(--lavender-soft)',
    butter:   'var(--butter-soft)',
    sky:      'var(--sky-soft)',
  };
  const pads = { none: 0, sm: 'var(--space-3)', md: 'var(--space-5)', lg: 'var(--space-8)' };
  return (
    <div
      style={{
        background: tones[tone] || tones.card,
        borderRadius: 'var(--radius-lg)',
        boxShadow: shadows[elevation] || shadows.md,
        padding: pads[pad] ?? pads.md,
        color: 'var(--text-strong)',
        fontFamily: 'var(--font-body)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
