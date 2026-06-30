'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
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
import { ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useUsers } from '../hooks/use-users';
import { getUserColumns } from './user-columns';
import { UserRowActions } from './user-row-actions';
import { UserToolbar } from './user-toolbar';
import { SkeletonRow } from '@/components/shared/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { Users } from 'lucide-react';
import type { User } from '../types';
import type { Role } from '@/lib/rbac';
import { cn } from '@/lib/utils';

interface UserTableProps {
  currentUserRole?: Role;
}

export function UserTable({ currentUserRole }: UserTableProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');

  const sort = (sorting[0]?.id ?? 'createdAt') as keyof User;
  const order = sorting[0]?.desc === false ? 'asc' : 'desc';

  const { data, isLoading, isError } = useUsers({
    page,
    limit,
    sort,
    order,
    search,
  });

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

  return (
    <div className="space-y-4">
      <UserToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        total={data?.total ?? 0}
      />

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    className={cn(
                      'h-10 text-xs font-medium text-muted-foreground',
                      header.column.getCanSort() && 'cursor-pointer select-none',
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : (header.column.columnDef.header as string)}
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
                <SkeletonRow key={i} cols={5} />
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-32">
                  <EmptyState
                    icon={<Users className="h-6 w-6 text-muted-foreground" />}
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
                      {typeof cell.column.columnDef.cell === 'function'
                        ? (cell.column.columnDef.cell as any)(cell.getContext())
                        : null}
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
            <span className="text-xs text-muted-foreground">Rows per page</span>
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
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
