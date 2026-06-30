import { cn } from '@/lib/utils';
import type { HTMLAttributes, ElementType } from 'react';

// ═══════════════════════════════════════════
// Typography Scale — tecton Design System
// ═══════════════════════════════════════════
//
// Font: Geist (Sans) + Geist Mono (Monospace)
// Weights: 300 (light), 400 (regular), 500 (medium),
//          600 (semibold), 700 (bold)
// Features: cv01 (alt 'a'), ss03 (geometric forms)

type TypographyVariant =
  | 'h1'       // Page titles — 24px semibold
  | 'h2'       // Section headers — 20px semibold
  | 'h3'       // Card headers — 16px semibold
  | 'h4'       // Sub-headers — 14px semibold
  | 'body'     // Default body — 14px regular, 1.6 leading
  | 'body-sm'  // Small body — 13px regular
  | 'caption'  // Muted metadata — 12px
  | 'label'    // Form labels — 14px medium
  | 'stat'     // Dashboard stat numbers — 28px semibold
  | 'mono'     // Code / technical — 13px mono
  | 'mono-sm'; // Small code — 12px mono

const styles: Record<TypographyVariant, string> = {
  h1:        'text-2xl font-semibold tracking-tight',
  h2:        'text-xl font-semibold tracking-tight',
  h3:        'text-base font-semibold tracking-tight',
  h4:        'text-sm font-semibold tracking-tight',
  body:      'text-sm leading-relaxed font-normal',
  'body-sm': 'text-[13px] leading-relaxed font-normal',
  caption:   'text-xs text-muted-foreground font-normal',
  label:     'text-sm font-medium leading-none',
  stat:      'text-[28px] font-semibold tracking-tight tabular-nums',
  mono:      'font-mono text-[13px] leading-relaxed',
  'mono-sm': 'font-mono text-xs leading-relaxed',
};

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: ElementType;
}

export function Typography({
  variant = 'body',
  as,
  className,
  ...props
}: TypographyProps) {
  const Component = as || defaultElement(variant);
  return (
    <Component className={cn(styles[variant], className)} {...props} />
  );
}

function defaultElement(variant: TypographyVariant): ElementType {
  switch (variant) {
    case 'h1': case 'h2': case 'h3': case 'h4':
      return variant; // h1 → <h1>, etc.
    case 'label': case 'caption':
      return 'span';
    case 'mono': case 'mono-sm':
      return 'code';
    case 'stat':
      return 'span';
    default:
      return 'p';
  }
}

// ── Convenience Components ─────────────────

export function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn(styles.h1, className)} {...props} />;
}
export function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn(styles.h2, className)} {...props} />;
}
export function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn(styles.h3, className)} {...props} />;
}
export function H4({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn(styles.h4, className)} {...props} />;
}

export function Caption({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(styles.caption, className)} {...props} />;
}

export function Stat({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(styles.stat, className)} {...props} />;
}

export function Mono({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <code className={cn(styles.mono, className)} {...props} />;
}
