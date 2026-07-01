import { Breadcrumbs } from './breadcrumbs';
import { H1 } from '@/components/ui/typography';

interface PageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function PageShell({ title, description, children, action }: PageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Breadcrumbs />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <H1>{title}</H1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
