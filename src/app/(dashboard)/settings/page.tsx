import { PageShell } from '@/components/layout/page-shell';
import { auth } from '@/auth';
import { StatusBadge } from '@/components/shared/status-badge';
import type { Role } from '@/lib/rbac';

export default async function SettingsPage() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;

  return (
    <PageShell
      title="Settings"
      description="Manage your account and application preferences."
    >
      <div className="grid gap-4 max-w-2xl">
        {/* Profile */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Profile</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {session?.user?.name || 'Unknown User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
              <StatusBadge variant="default" dot className="ml-auto">
                {role}
              </StatusBadge>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Appearance</h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark mode using the sun/moon icon in the
              header. Your preference is saved automatically.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-destructive/30 bg-card">
          <div className="border-b border-destructive/20 px-4 py-3">
            <h3 className="text-sm font-semibold text-destructive">
              Danger Zone
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              Destructive actions like account deletion or data reset will
              appear here.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
