import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function AdminTable({
  columns,
  rows,
  isLoading,
  emptyMessage = 'No items yet.',
}: {
  columns: Array<{ key: string; header: string; className?: string }>
  rows: Array<{ id: string; cells: Record<string, ReactNode> }>
  isLoading?: boolean
  emptyMessage?: string
}) {
  if (isLoading) return <AdminTableSkeleton />
  if (rows.length === 0) return <EmptyState message={emptyMessage} />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {row.cells[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
