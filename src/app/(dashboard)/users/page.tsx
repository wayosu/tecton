import { PageShell } from '@/components/layout/page-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import { hasPermission } from '@/lib/rbac';
import type { Role } from '@/lib/rbac';

export default async function UsersPage() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;
  const canCreate = hasPermission(role, 'users:create');

  return (
    <PageShell
      title="Users"
      description="Manage user accounts, roles, and permissions."
      action={
        canCreate ? (
          <Button size="sm" disabled>
            Add User
          </Button>
        ) : undefined
      }
    >
      <EmptyState
        icon={Users}
        title="No users yet"
        description="User management will display here once connected. Advanced features include sorting, filtering, pagination, and role management."
        action={
          canCreate
            ? {
                label: 'Add your first user',
                onClick: () => {},
              }
            : undefined
        }
      />
    </PageShell>
  );
}
