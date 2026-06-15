import React from 'react';

/**
 * Button — friendly rounded pill button.
 * Variants: primary (brand coral), secondary (soft tint), ghost (text only).
 * Sizes: sm | md | lg. Press = gentle shrink.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { fontSize: 14, padding: '8px 16px', minHeight: 36, gap: 6 },
    md: { fontSize: 16, padding: '12px 22px', minHeight: 46, gap: 8 },
    lg: { fontSize: 18, padding: '15px 28px', minHeight: 54, gap: 10 },
  };
  const variants = {
    primary: {
      background: 'var(--brand)',
      color: 'var(--on-brand)',
      border: 'none',
      boxShadow: '0 4px 0 var(--brand-press), 0 6px 14px rgba(232,117,92,.30)',
    },
    secondary: {
      background: 'var(--brand-tint)',
      color: 'var(--brand-press)',
      border: 'none',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: 'none',
      boxShadow: 'none',
    },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: s.fontSize,
        padding: s.padding,
        minHeight: s.minHeight,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft), filter var(--dur-fast) var(--ease-soft)',
        WebkitTapHighlightColor: 'transparent',
        ...v,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(2px) scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
