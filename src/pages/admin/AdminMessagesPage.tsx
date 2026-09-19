import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminFormDialog } from '@/components/admin/AdminFormDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTable } from '@/components/admin/AdminTable'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import {
  useAdminContactMessages,
  useDeleteContactMessage,
  useUpdateContactMessage,
} from '@/hooks/useAdminPortfolioMutations'
import type { ContactMessage } from '@/types/portfolio'

function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function AdminMessagesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminContactMessages({
    page,
    page_size: 20,
  })
  const update = useUpdateContactMessage()
  const remove = useDeleteContactMessage()
  const [viewing, setViewing] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState<ContactMessage | null>(null)

  const items = data?.items ?? []

  const openMessage = (message: ContactMessage) => {
    setViewing(message)
    if (!message.is_read) {
      update.mutate({ id: message.id, is_read: true })
    }
  }

  return (
    <div className="space-y-6">
      <Seo title="Admin — Messages" />
      <AdminPageHeader
        title="Messages"
        description="Submissions from the Get In Touch form."
      />

      <AdminTable
        isLoading={isLoading}
        emptyMessage="No messages yet."
        columns={[
          { key: 'status', header: '' },
          { key: 'name', header: 'From' },
          { key: 'subject', header: 'Subject' },
          { key: 'when', header: 'Received' },
          { key: 'actions', header: '' },
        ]}
        rows={items.map((item) => ({
          id: item.id,
          cells: {
            status: item.is_read ? (
              <span className="font-mono text-xs text-slate">Read</span>
            ) : (
              <span className="font-mono text-xs text-green">New</span>
            ),
            name: (
              <button
                type="button"
                className="text-left text-lightest-slate hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
                onClick={() => openMessage(item)}
              >
                {item.name}
                <span className="mt-0.5 block font-mono text-xs text-slate">
                  {item.email}
                </span>
              </button>
            ),
            subject: item.subject,
            when: (
              <span className="font-mono text-xs text-slate">
                {formatWhen(item.created_at)}
              </span>
            ),
            actions: (
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => openMessage(item)}>
                  View
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleting(item)}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        }))}
      />

      {data && data.total_pages > 1 ? (
        <Pagination
          page={data.page}
          totalPages={data.total_pages}
          onPageChange={setPage}
        />
      ) : null}

      <AdminFormDialog
        open={Boolean(viewing)}
        onOpenChange={(v) => !v && setViewing(null)}
        title={viewing?.subject ?? 'Message'}
        description={
          viewing
            ? `${viewing.name} · ${formatWhen(viewing.created_at)}`
            : undefined
        }
      >
        {viewing ? (
          <div className="space-y-4 text-sm">
            <p>
              <a
                href={`mailto:${viewing.email}`}
                className="text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                {viewing.email}
              </a>
            </p>
            {viewing.phone ? (
              <p>
                <a
                  href={`tel:${viewing.phone.replace(/[^\d+]/g, '')}`}
                  className="text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
                >
                  {viewing.phone}
                </a>
              </p>
            ) : null}
            <p className="whitespace-pre-wrap text-slate">
              {viewing.message || 'No message body.'}
            </p>
            {viewing.is_read ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  update.mutate(
                    { id: viewing.id, is_read: false },
                    {
                      onSuccess: () =>
                        setViewing({ ...viewing, is_read: false }),
                    },
                  )
                }
              >
                Mark unread
              </Button>
            ) : null}
          </div>
        ) : null}
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete message"
        description={`Delete the message from “${deleting?.name ?? ''}”?`}
        loading={remove.isPending}
        onConfirm={() => {
          if (!deleting) return
          remove.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null)
              if (viewing?.id === deleting.id) setViewing(null)
            },
          })
        }}
      />
    </div>
  )
}
