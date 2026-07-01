import { PageShell } from '@/components/layout/page-shell';
import { auth } from '@/auth';
import { ProfileForm } from '@/features/settings/components/profile-form';
import { PasswordForm } from '@/features/settings/components/password-form';
import { StatusBadge } from '@/components/shared/status-badge';

export default async function SettingsPage() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <PageShell title="Settings" description="Manage your account and application preferences.">
      <div className="grid max-w-2xl gap-4">
        {/* Profile Header */}
        <div className="bg-card rounded-lg border">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Account</h3>
          </div>
          <div className="flex items-center gap-3 p-4">
            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{session?.user?.name || 'Unknown User'}</p>
              <p className="text-muted-foreground text-xs">{session?.user?.email}</p>
            </div>
            <StatusBadge variant="default" dot className="ml-auto">
              {role}
            </StatusBadge>
          </div>
        </div>

        {/* Edit Profile */}
        <ProfileForm
          defaultName={session?.user?.name ?? null}
          defaultEmail={session?.user?.email ?? null}
        />

        {/* Change Password */}
        <PasswordForm />

        {/* Appearance */}
        <div className="bg-card rounded-lg border">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Appearance</h3>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">
              Toggle between light and dark mode using the sun/moon icon in the header. Your
              preference is saved automatically.
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-destructive/30 bg-card rounded-lg border">
          <div className="border-destructive/20 border-b px-4 py-3">
            <h3 className="text-destructive text-sm font-semibold">Danger Zone</h3>
          </div>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">
              Destructive actions like account deletion or data reset will appear here.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
