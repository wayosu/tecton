import { PageShell } from '@/components/layout/page-shell';
import { UserTable } from '@/features/users/components/user-table';
import { auth } from '@/auth';
import type { Role } from '@/lib/rbac';

export default async function UsersPage() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;

  return (
    <PageShell
      title="Users"
      description="Manage user accounts, roles, and permissions."
    >
      <UserTable currentUserRole={role} />
    </PageShell>
  );
}
