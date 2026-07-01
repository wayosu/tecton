import { Shell } from '@/components/layout/shell';
import { ErrorBoundary } from '@/components/shared/error-boundary';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Shell>
  );
}
