import { cn } from '@/lib/utils';
import type { HTMLAttributes, ElementType } from 'react';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label';

const styles: Record<TypographyVariant, string> = {
  h1: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h2: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h4: 'scroll-m-20 text-base font-semibold tracking-tight',
  body: 'text-sm leading-relaxed',
  'body-sm': 'text-xs leading-relaxed',
  caption: 'text-xs text-muted-foreground',
  label: 'text-sm font-medium leading-none',
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
    case 'h1': return 'h1';
    case 'h2': return 'h2';
    case 'h3': return 'h3';
    case 'h4': return 'h4';
    case 'caption': return 'p';
    case 'label': return 'span';
    default: return 'p';
  }
}

// Convenience exports
export function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn(styles.h1, className)} {...props} />;
}
export function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn(styles.h2, className)} {...props} />;
}
export function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn(styles.h3, className)} {...props} />;
}
