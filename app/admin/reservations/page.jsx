'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { formatCurrency, formatPersianDate } from '@/lib/persian-utils'
import { translateReservationStatus } from '@/lib/translations'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchReservations()
  }, [status, page])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        ...(status && { status }),
      })
      const res = await fetch(`/api/admin/reservations?${query}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setReservations(data.reservations)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">مدیریت رزروها</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {['', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((s) => (
          <Button
            key={s}
            variant={status === s ? 'default' : 'outline'}
            onClick={() => {
              setStatus(s)
              setPage(1)
            }}
          >
            {s ? translateReservationStatus(s) : 'همه'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Table */}
          <Card className="overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-semibold">شماره رزرو</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">نام مهمان</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">هتل</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">مبلغ</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">وضعیت</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">تاریخ</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-muted/50">
                      <td className="px-6 py-3">
                        <span className="font-mono text-sm">{reservation.code}</span>
                      </td>
                      <td className="px-6 py-3">
                        {reservation.guestFirstName} {reservation.guestLastName}
                      </td>
                      <td className="px-6 py-3">{reservation.hotelName}</td>
                      <td className="px-6 py-3">{formatCurrency(reservation.totalPrice)}</td>
                      <td className="px-6 py-3">
                        <Badge className={getStatusBadgeColor(reservation.status)}>
                          {translateReservationStatus(reservation.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {formatPersianDate(reservation.createdAt)}
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/admin/reservations/${reservation.code}`}>
                          <Button variant="outline" size="sm">
                            مشاهده
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-center gap-4">
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
