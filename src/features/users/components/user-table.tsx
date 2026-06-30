'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Users,
} from 'lucide-react';
import { useUsers } from '../hooks/use-users';
import { getUserColumns } from './user-columns';
import { UserRowActions } from './user-row-actions';
import { UserToolbar } from './user-toolbar';
import { UserFormDialog } from './user-form-dialog';
import { UserDeleteDialog } from './user-delete-dialog';
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hooks/use-user-mutations';
import { Skeleton } from '@/components/shared/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { hasPermission } from '@/lib/rbac';
import type { User } from '../types';
import type { Role } from '@/lib/rbac';
import type { CreateUserInput, UpdateUserInput } from '../types';
import { cn } from '@/lib/utils';

interface UserTableProps {
  currentUserRole?: Role;
}

export function UserTable({ currentUserRole }: UserTableProps) {
  // Table state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');

  // Dialog state
  const [dialogMode, setDialogMode] = useState<
    'create' | 'edit' | 'delete' | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const sort = (sorting[0]?.id ?? 'createdAt') as keyof User;
  const order = sorting[0]?.desc === false ? 'asc' : 'desc';

  const { data, isLoading, isError } = useUsers({
    page,
    limit,
    sort,
    order,
    search,
  });

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const columns = getUserColumns(currentUserRole);

  // Add actions column
  const allColumns: ColumnDef<User>[] = [
    ...columns,
    {
      id: 'actions',
      cell: ({ row }) => (
        <UserRowActions
          user={row.original}
          currentUserRole={currentUserRole}
          onEdit={(user) => {
            setSelectedUser(user);
            setDialogMode('edit');
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setDialogMode('delete');
          }}
        />
      ),
      size: 40,
    },
  ];

  const table = useReactTable({
    data: data?.data ?? [],
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    manualSorting: true,
    manualPagination: true,
    pageCount: data?.totalPages ?? 0,
  });

  // Error state
  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">Failed to load users.</p>
      </div>
    );
  }

  const showAddButton =
    currentUserRole && hasPermission(currentUserRole, 'users:create');

  return (
    <div className="space-y-4">
      {/* Toolbar + Add Button */}
      <div className="flex items-center justify-between">
        <UserToolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          total={data?.total ?? 0}
        />
        {showAddButton && (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedUser(null);
              setDialogMode('create');
            }}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add User
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150
                          ? header.getSize()
                          : undefined,
                    }}
                    className={cn(
                      'h-10 text-xs font-medium text-muted-foreground',
                      header.column.getCanSort() &&
                        'cursor-pointer select-none',
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {{
                            asc: <ArrowUp className="h-3 w-3" />,
                            desc: <ArrowDown className="h-3 w-3" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDown className="h-3 w-3 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j} className="py-3">
                      <Skeleton
                        className={cn(
                          'h-4',
                          j === 0 ? 'w-32' : 'w-full',
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-32">
                  <EmptyState
                    icon={
                      <Users className="h-6 w-6 text-muted-foreground" />
                    }
                    title={search ? 'No users found' : 'No users yet'}
                    description={
                      search
                        ? `No results for "${search}". Try a different search.`
                        : 'Users will appear here once added.'
                    }
                    className="border-0 bg-transparent py-8"
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Rows per page
            </span>
            <Select
              value={String(limit)}
              onValueChange={(v) => {
                setLimit(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              Page {data.page} of {data.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages, p + 1))
                }
                disabled={page >= data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      {(dialogMode === 'create' || dialogMode === 'edit') && (
        <UserFormDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setDialogMode(null);
          }}
          user={selectedUser ?? undefined}
          currentUserRole={currentUserRole}
          onSubmit={(data) => {
            if (dialogMode === 'create') {
              createMutation.mutate(data as CreateUserInput, {
                onSuccess: () => setDialogMode(null),
              });
            } else {
              updateMutation.mutate(
                {
                  id: selectedUser!.id,
                  ...(data as UpdateUserInput),
                },
                { onSuccess: () => setDialogMode(null) },
              );
            }
          }}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Dialog */}
      <UserDeleteDialog
        open={dialogMode === 'delete'}
        onOpenChange={(open) => {
          if (!open) setDialogMode(null);
        }}
        user={selectedUser}
        onConfirm={(user) => {
          deleteMutation.mutate(user.id, {
            onSuccess: () => setDialogMode(null),
          });
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
