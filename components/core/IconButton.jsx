import React from 'react';

/**
 * IconButton — square, soft-tinted control for toolbar icons
 * (menu, help, stats, settings). Pass a Lucide SVG (or any node) as children.
 * shape: 'rounded' (default) | 'circle'.
 */
export function IconButton({
  children,
  label,
  size = 'md',
  shape = 'rounded',
  tone = 'soft',
  style = {},
  ...rest
}) {
  const sizes = { sm: 36, md: 44, lg: 52 };
  const dim = sizes[size] || sizes.md;
  const tones = {
    soft:  { background: 'var(--bg-sunken)', color: 'var(--text-body)' },
    plain: { background: 'transparent',      color: 'var(--text-body)' },
    brand: { background: 'var(--brand-tint)',color: 'var(--brand-press)' },
  };
  const t = tones[tone] || tones.soft;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        flex: '0 0 auto',
        border: 'none',
        borderRadius: shape === 'circle' ? '999px' : 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'transform var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
        WebkitTapHighlightColor: 'transparent',
        ...t,
        ...style,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
