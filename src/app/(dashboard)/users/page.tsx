import { auth } from '@/auth';

export default async function UsersPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and roles.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          User management table coming soon. This will include sorting,
          filtering, pagination, and role management powered by TanStack
          Table.
        </p>
      </div>
    </div>
  );
}
