import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-muted text-muted-foreground',
        success: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning: 'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400',
        danger: 'border-transparent bg-red-500/10 text-red-600 dark:text-red-400',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-primary': variant === 'default',
            'bg-muted-foreground': variant === 'secondary',
            'bg-emerald-500': variant === 'success',
            'bg-amber-500': variant === 'warning',
            'bg-red-500': variant === 'danger',
            'bg-foreground': variant === 'outline',
          })}
        />
      )}
      {children}
    </div>
  );
}
