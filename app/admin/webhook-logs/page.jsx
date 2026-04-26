'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { formatPersianDate } from '@/lib/persian-utils'
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchLogs()
  }, [page])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/webhook-logs?page=${page}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setLogs(data.logs)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">گزارش وبهوک</h1>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {logs.map((log) => (
              <Card
                key={log.id}
                className="p-6 cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  setExpandedId(expandedId === log.id ? null : log.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{log.event}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPersianDate(log.createdAt)}
                    </p>
                  </div>
                  {expandedId === log.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>

                {expandedId === log.id && (
                  <div className="mt-4 pt-4 border-t">
                    <pre className="bg-muted p-4 rounded overflow-auto max-h-96 text-xs">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                صفحه {page} از {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page === pagination.pages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
